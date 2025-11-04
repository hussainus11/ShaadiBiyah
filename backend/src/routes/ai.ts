import express from 'express';
import { AIController } from '../controllers/aiController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All AI routes require authentication
router.use(protect);

// AI Assistant routes
router.post('/chat', AIController.chatWithAI);
router.get('/conversations', AIController.getConversations);
router.get('/conversations/:id', AIController.getConversation);
router.delete('/conversations/:id', AIController.deleteConversation);

// Wedding Planning Assistant
router.post('/suggest-vendors', AIController.suggestVendors);
router.post('/create-checklist', AIController.createWeddingChecklist);
router.post('/budget-estimate', AIController.estimateBudget);
router.post('/timeline-suggestions', AIController.getTimelineSuggestions);

export default router;







