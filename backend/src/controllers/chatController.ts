import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export class ChatController {
  static getChatSessions = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    const chatSessions = await prisma.chatSession.findMany({
      where: {
        OR: [
          { userId },
          { vendorId: userId }
        ],
        isActive: true
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            profileImage: true
          }
        },
        vendor: {
          select: {
            businessName: true,
            profileImage: true,
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: { lastMessageAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: chatSessions
    });
  });

  static sendMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { receiverId, content, messageType = 'text', attachments = [] } = req.body;

    // Create message in database
    const message = await prisma.message.create({
      data: {
        senderId: userId,
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
            lastName: true,
            profileImage: true
          }
        }
      }
    });

    // Update or create chat session
    await prisma.chatSession.upsert({
      where: {
        userId_vendorId: {
          userId: userId,
          vendorId: receiverId
        }
      },
      update: {
        lastMessageAt: new Date(),
        isActive: true
      },
      create: {
        userId: userId,
        vendorId: receiverId,
        lastMessageAt: new Date(),
        isActive: true
      }
    });

    // Create notification for receiver
    await prisma.notification.create({
      data: {
        userId: receiverId,
        title: 'New Message',
        message: `You have a new message from ${message.sender.firstName} ${message.sender.lastName}`,
        type: 'message'
      }
    });

    res.status(201).json({
      success: true,
      data: message,
      message: 'Message sent successfully'
    });
  });

  static getMessages = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { sessionId } = req.params;
    const userId = req.user!.id;
    const { page = 1, limit = 50 } = req.query;
  
    // Verify user is part of this chat session
    const session = await prisma.chatSession.findFirst({
      where: {
        id: sessionId,
        OR: [
          { userId },
          { vendorId: userId }
        ]
      }
    });
  
    if (!session) {
      res.status(404).json({
        success: false,
        error: 'Chat session not found'
      });
      return; // ✅ Ensure function exits properly
    }
  
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.userId, receiverId: session.vendorId },
          { senderId: session.vendorId, receiverId: session.userId }
        ]
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
            lastName: true,
            profileImage: true
          }
        }
      },
      skip,
      take: parseInt(limit as string),
      orderBy: { createdAt: 'asc' }
    });
  
    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        receiverId: userId,
        senderId: session.userId === userId ? session.vendorId : session.userId,
        isRead: false
      },
      data: { isRead: true }
    });
  
    res.status(200).json({
      success: true,
      data: messages
    });
  });
  

  static markMessageAsRead = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { messageId } = req.params;
    const userId = req.user!.id;
  
    const message = await prisma.message.findFirst({
      where: {
        id: messageId,
        receiverId: userId
      }
    });
  
    if (!message) {
      res.status(404).json({
        success: false,
        error: 'Message not found'
      });
      return; // ✅ explicitly exit here
    }
  
    await prisma.message.update({
      where: { id: messageId },
      data: { isRead: true }
    });
  
    res.status(200).json({
      success: true,
      message: 'Message marked as read'
    });
  
    return; // ✅ optional but clear that function completes here
  });
  
}







