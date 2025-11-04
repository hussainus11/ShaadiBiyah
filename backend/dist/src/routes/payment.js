"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.post('/create-intent', paymentController_1.PaymentController.createPaymentIntent);
router.post('/confirm', paymentController_1.PaymentController.confirmPayment);
router.get('/history', paymentController_1.PaymentController.getPaymentHistory);
router.post('/refund', paymentController_1.PaymentController.processRefund);
router.post('/webhook/stripe', paymentController_1.PaymentController.handleStripeWebhook);
exports.default = router;
//# sourceMappingURL=payment.js.map