"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vendorController_1 = require("../controllers/vendorController");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/', vendorController_1.VendorController.getVendors);
router.get('/:id', vendorController_1.VendorController.getVendor);
router.get('/:id/services', vendorController_1.VendorController.getVendorServices);
router.get('/:id/reviews', vendorController_1.VendorController.getVendorReviews);
router.use(auth_1.protect);
router.post('/register', (0, validation_1.validateRequest)(validation_1.schemas.vendorRegistration), vendorController_1.VendorController.registerVendor);
router.put('/profile', (0, auth_1.authorize)('VENDOR'), vendorController_1.VendorController.updateVendorProfile);
router.get('/profile/me', (0, auth_1.authorize)('VENDOR'), vendorController_1.VendorController.getMyVendorProfile);
router.post('/services', (0, auth_1.authorize)('VENDOR'), vendorController_1.VendorController.createService);
router.put('/services/:serviceId', (0, auth_1.authorize)('VENDOR'), vendorController_1.VendorController.updateService);
router.delete('/services/:serviceId', (0, auth_1.authorize)('VENDOR'), vendorController_1.VendorController.deleteService);
router.get('/bookings/my', (0, auth_1.authorize)('VENDOR'), vendorController_1.VendorController.getMyBookings);
router.put('/bookings/:bookingId/status', (0, auth_1.authorize)('VENDOR'), vendorController_1.VendorController.updateBookingStatus);
router.get('/analytics/dashboard', (0, auth_1.authorize)('VENDOR'), vendorController_1.VendorController.getVendorAnalytics);
exports.default = router;
//# sourceMappingURL=vendor.js.map