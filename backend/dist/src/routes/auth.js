"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/register', (0, validation_1.validateRequest)(validation_1.schemas.register), authController_1.AuthController.register);
router.post('/login', (0, validation_1.validateRequest)(validation_1.schemas.login), authController_1.AuthController.login);
router.post('/forgot-password', authController_1.AuthController.forgotPassword);
router.post('/reset-password', authController_1.AuthController.resetPassword);
router.post('/verify-email', authController_1.AuthController.verifyEmail);
router.use(auth_1.protect);
router.get('/me', authController_1.AuthController.getMe);
router.post('/logout', authController_1.AuthController.logout);
router.put('/change-password', authController_1.AuthController.changePassword);
exports.default = router;
//# sourceMappingURL=auth.js.map