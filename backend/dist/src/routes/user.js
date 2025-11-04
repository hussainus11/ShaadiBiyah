"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.get('/profile', userController_1.UserController.getProfile);
router.put('/profile', (0, validation_1.validateRequest)(validation_1.schemas.updateProfile), userController_1.UserController.updateProfile);
router.post('/profile/image', userController_1.UserController.uploadProfileImage);
router.get('/dashboard', userController_1.UserController.getDashboard);
router.get('/bookings', userController_1.UserController.getUserBookings);
router.get('/notifications', userController_1.UserController.getNotifications);
router.put('/notifications/:id/read', userController_1.UserController.markNotificationRead);
router.post('/reviews', (0, validation_1.validateRequest)(validation_1.schemas.createReview), userController_1.UserController.createReview);
router.get('/reviews', userController_1.UserController.getUserReviews);
router.get('/checklist', userController_1.UserController.getWeddingChecklist);
router.post('/checklist', userController_1.UserController.createChecklistItem);
router.put('/checklist/:id', userController_1.UserController.updateChecklistItem);
router.delete('/checklist/:id', userController_1.UserController.deleteChecklistItem);
exports.default = router;
//# sourceMappingURL=user.js.map