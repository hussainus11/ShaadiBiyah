import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

export const initializeSocket = (io: Server) => {
  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, role: true }
      });

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user.id;
      socket.userRole = user.role;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User ${socket.userId} connected`);

    // Join user-specific room
    socket.join(`user_${socket.userId}`);

    // Handle joining chat room
    socket.on('join_chat', async (data: { otherUserId: string }) => {
      try {
        const { otherUserId } = data;
        
        // Verify users can chat (have existing booking or are vendor-customer)
        const canChat = await verifyChatPermission(socket.userId!, otherUserId);
        
        if (!canChat) {
          socket.emit('chat_error', { message: 'Chat permission denied' });
          return;
        }

        const roomId = generateRoomId(socket.userId!, otherUserId);
        socket.join(roomId);
        
        socket.emit('joined_chat', { roomId });
        
        // Mark messages as read
        await prisma.message.updateMany({
          where: {
            senderId: otherUserId,
            receiverId: socket.userId!,
            isRead: false
          },
          data: { isRead: true }
        });
        
      } catch (error) {
        socket.emit('chat_error', { message: 'Failed to join chat' });
      }
    });

    // Handle sending messages
    socket.on('send_message', async (data: {
      receiverId: string;
      content: string;
      messageType?: string;
      attachments?: string[];
    }) => {
      try {
        const { receiverId, content, messageType = 'text', attachments = [] } = data;

        // Verify chat permission
        const canChat = await verifyChatPermission(socket.userId!, receiverId);
        
        if (!canChat) {
          socket.emit('chat_error', { message: 'Chat permission denied' });
          return;
        }

        // Create message in database
        const message = await prisma.message.create({
          data: {
            senderId: socket.userId!,
            receiverId,
            content,
            messageType,
            attachments
          },
          include: {
            sender: {
              select: {
                firstName: true,
                lastName: true,
                profileImage: true
              }
            },
            receiver: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        });

        // Update or create chat session
        await prisma.chatSession.upsert({
          where: {
            userId_vendorId: {
              userId: socket.userId!,
              vendorId: receiverId
            }
          },
          update: {
            lastMessageAt: new Date(),
            isActive: true
          },
          create: {
            userId: socket.userId!,
            vendorId: receiverId,
            lastMessageAt: new Date(),
            isActive: true
          }
        });

        const roomId = generateRoomId(socket.userId!, receiverId);
        
        // Emit message to room
        io.to(roomId).emit('new_message', message);
        
        // Emit notification to receiver if not in room
        const receiverSocket = Array.from(io.sockets.sockets.values())
          .find((s: AuthenticatedSocket) => s.userId === receiverId);
          
        if (!receiverSocket || !receiverSocket.rooms.has(roomId)) {
          io.to(`user_${receiverId}`).emit('message_notification', {
            message,
            unreadCount: await getUnreadCount(receiverId)
          });
        }

        // Create notification
        await prisma.notification.create({
          data: {
            userId: receiverId,
            title: 'New Message',
            message: `You have a new message from ${message.sender.firstName} ${message.sender.lastName}`,
            type: 'message'
          }
        });

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('chat_error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (data: { receiverId: string }) => {
      const roomId = generateRoomId(socket.userId!, data.receiverId);
      socket.to(roomId).emit('user_typing', {
        userId: socket.userId,
        isTyping: true
      });
    });

    socket.on('typing_stop', (data: { receiverId: string }) => {
      const roomId = generateRoomId(socket.userId!, data.receiverId);
      socket.to(roomId).emit('user_typing', {
        userId: socket.userId,
        isTyping: false
      });
    });

    // Handle booking notifications
    socket.on('booking_update', async (data: { bookingId: string, status: string }) => {
      try {
        const booking = await prisma.booking.findUnique({
          where: { id: data.bookingId },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            },
            vendor: {
              select: {
                businessName: true
              }
            }
          }
        });

        if (booking) {
          // Notify user about booking status change
          io.to(`user_${booking.userId}`).emit('booking_notification', {
            booking,
            message: `Your booking with ${booking.vendor.businessName} has been ${data.status.toLowerCase()}`
          });

          // Create notification
          await prisma.notification.create({
            data: {
              userId: booking.userId,
              title: 'Booking Update',
              message: `Your booking with ${booking.vendor.businessName} has been ${data.status.toLowerCase()}`,
              type: 'booking'
            }
          });
        }
      } catch (error) {
        console.error('Error handling booking update:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected`);
    });
  });
};

// Helper functions
const generateRoomId = (userId1: string, userId2: string): string => {
  return [userId1, userId2].sort().join('_');
};

const verifyChatPermission = async (userId1: string, userId2: string): Promise<boolean> => {
  try {
    // Check if users have existing bookings together
    const existingBooking = await prisma.booking.findFirst({
      where: {
        OR: [
          { userId: userId1, vendorId: userId2 },
          { userId: userId2, vendorId: userId1 }
        ]
      }
    });

    return !!existingBooking;
  } catch (error) {
    console.error('Error verifying chat permission:', error);
    return false;
  }
};

const getUnreadCount = async (userId: string): Promise<number> => {
  try {
    return await prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false
      }
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};







