"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = require("../controllers/chatController");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.get('/sessions', chatController_1.ChatController.getChatSessions);
router.post('/messages', (0, validation_1.validateRequest)(validation_1.schemas.createMessage), chatController_1.ChatController.sendMessage);
router.get('/messages/:sessionId', chatController_1.ChatController.getMessages);
router.put('/messages/:messageId/read', chatController_1.ChatController.markMessageAsRead);
exports.default = router;
//# sourceMappingURL=chat.js.map