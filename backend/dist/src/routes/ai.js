"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aiController_1 = require("../controllers/aiController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.post('/chat', aiController_1.AIController.chatWithAI);
router.get('/conversations', aiController_1.AIController.getConversations);
router.get('/conversations/:id', aiController_1.AIController.getConversation);
router.delete('/conversations/:id', aiController_1.AIController.deleteConversation);
router.post('/suggest-vendors', aiController_1.AIController.suggestVendors);
router.post('/create-checklist', aiController_1.AIController.createWeddingChecklist);
router.post('/budget-estimate', aiController_1.AIController.estimateBudget);
router.post('/timeline-suggestions', aiController_1.AIController.getTimelineSuggestions);
exports.default = router;
//# sourceMappingURL=ai.js.map