import express from 'express';
import { ChatController } from '../controllers/chatController';
import { validateRequest, schemas } from '../middleware/validation';
import { protect } from '../middleware/auth';

const router = express.Router();

// All chat routes require authentication
router.use(protect);

// Chat routes
router.get('/sessions', ChatController.getChatSessions);
router.post('/messages', validateRequest(schemas.createMessage), ChatController.sendMessage);
router.get('/messages/:sessionId', ChatController.getMessages);
router.put('/messages/:messageId/read', ChatController.markMessageAsRead);

export default router;







