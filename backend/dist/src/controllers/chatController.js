"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const client_1 = require("@prisma/client");
const errorHandler_1 = require("../middleware/errorHandler");
const prisma = new client_1.PrismaClient();
class ChatController {
}
exports.ChatController = ChatController;
_a = ChatController;
ChatController.getChatSessions = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
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
ChatController.sendMessage = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const { receiverId, content, messageType = 'text', attachments = [] } = req.body;
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
ChatController.getMessages = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { sessionId } = req.params;
    const userId = req.user.id;
    const { page = 1, limit = 50 } = req.query;
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
        return;
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
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
        take: parseInt(limit),
        orderBy: { createdAt: 'asc' }
    });
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
ChatController.markMessageAsRead = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { messageId } = req.params;
    const userId = req.user.id;
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
        return;
    }
    await prisma.message.update({
        where: { id: messageId },
        data: { isRead: true }
    });
    res.status(200).json({
        success: true,
        message: 'Message marked as read'
    });
    return;
});
//# sourceMappingURL=chatController.js.map