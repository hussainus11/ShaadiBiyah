"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookingController_1 = require("../controllers/bookingController");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.post('/', (0, validation_1.validateRequest)(validation_1.schemas.createBooking), bookingController_1.BookingController.createBooking);
router.get('/my', bookingController_1.BookingController.getUserBookings);
router.get('/:id', bookingController_1.BookingController.getBooking);
router.put('/:id', bookingController_1.BookingController.updateBooking);
router.delete('/:id', bookingController_1.BookingController.cancelBooking);
router.get('/vendor/my', (0, auth_1.authorize)('VENDOR'), bookingController_1.BookingController.getVendorBookings);
router.put('/:id/status', (0, auth_1.authorize)('VENDOR'), (0, validation_1.validateRequest)(validation_1.schemas.updateBookingStatus), bookingController_1.BookingController.updateBookingStatus);
exports.default = router;
//# sourceMappingURL=booking.js.map