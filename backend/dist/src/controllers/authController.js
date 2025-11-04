"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const errorHandler_1 = require("../middleware/errorHandler");
const email_1 = require("../utils/email");
const prisma = new client_1.PrismaClient();
class AuthController {
}
exports.AuthController = AuthController;
_a = AuthController;
AuthController.register = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { email, password, firstName, lastName, phone, role = 'USER' } = req.body;
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            error: 'User already exists with this email'
        });
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 12);
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phone,
            role: role
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
            isVerified: true,
            createdAt: true
        }
    });
    const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: process.env.JWT_EXPIRE || '30d' });
    await (0, email_1.sendEmail)({
        email: user.email,
        subject: 'Welcome to WeddingSaaS - Verify Your Email',
        template: 'welcome',
        data: {
            firstName: user.firstName,
            verificationToken: token
        }
    });
    return res.status(201).json({
        success: true,
        data: {
            user,
            token
        },
        message: 'User registered successfully. Please check your email for verification.'
    });
});
AuthController.login = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            vendor: true
        }
    });
    if (!user) {
        return res.status(401).json({
            success: false,
            error: 'Invalid credentials'
        });
    }
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,
            error: 'Invalid credentials'
        });
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: process.env.JWT_EXPIRE || '30d' });
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({
        success: true,
        data: {
            user: userWithoutPassword,
            token
        },
        message: 'Login successful'
    });
});
AuthController.getMe = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
            vendor: true,
            bookings: {
                include: {
                    vendor: true,
                    service: true
                }
            }
        }
    });
    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({
        success: true,
        data: userWithoutPassword
    });
});
AuthController.logout = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
});
AuthController.forgotPassword = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
        where: { email }
    });
    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }
    const resetToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await (0, email_1.sendEmail)({
        email: user.email,
        subject: 'Password Reset Request',
        template: 'password-reset',
        data: {
            firstName: user.firstName,
            resetToken
        }
    });
    return res.status(200).json({
        success: true,
        message: 'Password reset email sent'
    });
});
AuthController.resetPassword = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { token, password } = req.body;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        await prisma.user.update({
            where: { id: decoded.id },
            data: { password: hashedPassword }
        });
        return res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            error: 'Invalid or expired token'
        });
    }
});
AuthController.verifyEmail = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { token } = req.body;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        await prisma.user.update({
            where: { id: decoded.id },
            data: { isVerified: true }
        });
        return res.status(200).json({
            success: true,
            message: 'Email verified successfully'
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            error: 'Invalid or expired token'
        });
    }
});
AuthController.changePassword = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({
        where: { id: req.user.id }
    });
    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }
    const isCurrentPasswordValid = await bcryptjs_1.default.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
        return res.status(400).json({
            success: false,
            error: 'Current password is incorrect'
        });
    }
    const hashedNewPassword = await bcryptjs_1.default.hash(newPassword, 12);
    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedNewPassword }
    });
    return res.status(200).json({
        success: true,
        message: 'Password changed successfully'
    });
});
//# sourceMappingURL=authController.js.map