"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const initializeSocket = (io) => {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
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
        }
        catch (error) {
            next(new Error('Authentication error'));
        }
    });
    io.on('connection', (socket) => {
        console.log(`User ${socket.userId} connected`);
        socket.join(`user_${socket.userId}`);
        socket.on('join_chat', async (data) => {
            try {
                const { otherUserId } = data;
                const canChat = await verifyChatPermission(socket.userId, otherUserId);
                if (!canChat) {
                    socket.emit('chat_error', { message: 'Chat permission denied' });
                    return;
                }
                const roomId = generateRoomId(socket.userId, otherUserId);
                socket.join(roomId);
                socket.emit('joined_chat', { roomId });
                await prisma.message.updateMany({
                    where: {
                        senderId: otherUserId,
                        receiverId: socket.userId,
                        isRead: false
                    },
                    data: { isRead: true }
                });
            }
            catch (error) {
                socket.emit('chat_error', { message: 'Failed to join chat' });
            }
        });
        socket.on('send_message', async (data) => {
            try {
                const { receiverId, content, messageType = 'text', attachments = [] } = data;
                const canChat = await verifyChatPermission(socket.userId, receiverId);
                if (!canChat) {
                    socket.emit('chat_error', { message: 'Chat permission denied' });
                    return;
                }
                const message = await prisma.message.create({
                    data: {
                        senderId: socket.userId,
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
                await prisma.chatSession.upsert({
                    where: {
                        userId_vendorId: {
                            userId: socket.userId,
                            vendorId: receiverId
                        }
                    },
                    update: {
                        lastMessageAt: new Date(),
                        isActive: true
                    },
                    create: {
                        userId: socket.userId,
                        vendorId: receiverId,
                        lastMessageAt: new Date(),
                        isActive: true
                    }
                });
                const roomId = generateRoomId(socket.userId, receiverId);
                io.to(roomId).emit('new_message', message);
                const receiverSocket = Array.from(io.sockets.sockets.values())
                    .find((s) => s.userId === receiverId);
                if (!receiverSocket || !receiverSocket.rooms.has(roomId)) {
                    io.to(`user_${receiverId}`).emit('message_notification', {
                        message,
                        unreadCount: await getUnreadCount(receiverId)
                    });
                }
                await prisma.notification.create({
                    data: {
                        userId: receiverId,
                        title: 'New Message',
                        message: `You have a new message from ${message.sender.firstName} ${message.sender.lastName}`,
                        type: 'message'
                    }
                });
            }
            catch (error) {
                console.error('Error sending message:', error);
                socket.emit('chat_error', { message: 'Failed to send message' });
            }
        });
        socket.on('typing_start', (data) => {
            const roomId = generateRoomId(socket.userId, data.receiverId);
            socket.to(roomId).emit('user_typing', {
                userId: socket.userId,
                isTyping: true
            });
        });
        socket.on('typing_stop', (data) => {
            const roomId = generateRoomId(socket.userId, data.receiverId);
            socket.to(roomId).emit('user_typing', {
                userId: socket.userId,
                isTyping: false
            });
        });
        socket.on('booking_update', async (data) => {
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
                    io.to(`user_${booking.userId}`).emit('booking_notification', {
                        booking,
                        message: `Your booking with ${booking.vendor.businessName} has been ${data.status.toLowerCase()}`
                    });
                    await prisma.notification.create({
                        data: {
                            userId: booking.userId,
                            title: 'Booking Update',
                            message: `Your booking with ${booking.vendor.businessName} has been ${data.status.toLowerCase()}`,
                            type: 'booking'
                        }
                    });
                }
            }
            catch (error) {
                console.error('Error handling booking update:', error);
            }
        });
        socket.on('disconnect', () => {
            console.log(`User ${socket.userId} disconnected`);
        });
    });
};
exports.initializeSocket = initializeSocket;
const generateRoomId = (userId1, userId2) => {
    return [userId1, userId2].sort().join('_');
};
const verifyChatPermission = async (userId1, userId2) => {
    try {
        const existingBooking = await prisma.booking.findFirst({
            where: {
                OR: [
                    { userId: userId1, vendorId: userId2 },
                    { userId: userId2, vendorId: userId1 }
                ]
            }
        });
        return !!existingBooking;
    }
    catch (error) {
        console.error('Error verifying chat permission:', error);
        return false;
    }
};
const getUnreadCount = async (userId) => {
    try {
        return await prisma.message.count({
            where: {
                receiverId: userId,
                isRead: false
            }
        });
    }
    catch (error) {
        console.error('Error getting unread count:', error);
        return 0;
    }
};
//# sourceMappingURL=socketHandler.js.map