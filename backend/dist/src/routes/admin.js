"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.use((0, auth_1.authorize)('ADMIN'));
router.get('/dashboard', adminController_1.AdminController.getDashboard);
router.get('/users', adminController_1.AdminController.getUsers);
router.put('/users/:id/status', adminController_1.AdminController.updateUserStatus);
router.delete('/users/:id', adminController_1.AdminController.deleteUser);
router.get('/vendors', adminController_1.AdminController.getVendors);
router.put('/vendors/:id/approve', adminController_1.AdminController.approveVendor);
router.put('/vendors/:id/reject', adminController_1.AdminController.rejectVendor);
router.get('/bookings', adminController_1.AdminController.getAllBookings);
router.put('/bookings/:id/status', adminController_1.AdminController.updateBookingStatus);
router.get('/analytics/overview', adminController_1.AdminController.getAnalyticsOverview);
router.get('/analytics/revenue', adminController_1.AdminController.getRevenueAnalytics);
router.get('/analytics/users', adminController_1.AdminController.getUserAnalytics);
exports.default = router;
//# sourceMappingURL=admin.js.map