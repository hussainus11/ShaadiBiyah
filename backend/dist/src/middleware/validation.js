"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = exports.validateRequest = void 0;
const zod_1 = require("zod");
const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params
            });
            return next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    success: false,
                    error: 'Validation failed',
                    details: error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                });
            }
            return next(error);
        }
    };
};
exports.validateRequest = validateRequest;
exports.schemas = {
    register: zod_1.z.object({
        body: zod_1.z.object({
            email: zod_1.z.string().email(),
            password: zod_1.z.string().min(6),
            firstName: zod_1.z.string().min(2),
            lastName: zod_1.z.string().min(2),
            phone: zod_1.z.string().optional(),
            role: zod_1.z.enum(['USER', 'VENDOR']).optional()
        })
    }),
    login: zod_1.z.object({
        body: zod_1.z.object({
            email: zod_1.z.string().email(),
            password: zod_1.z.string().min(1)
        })
    }),
    updateProfile: zod_1.z.object({
        body: zod_1.z.object({
            firstName: zod_1.z.string().min(2).optional(),
            lastName: zod_1.z.string().min(2).optional(),
            phone: zod_1.z.string().optional(),
            weddingDate: zod_1.z.string().datetime().optional(),
            budget: zod_1.z.number().positive().optional(),
            location: zod_1.z.string().optional()
        })
    }),
    vendorRegistration: zod_1.z.object({
        body: zod_1.z.object({
            businessName: zod_1.z.string().min(2),
            category: zod_1.z.enum(['VENUE', 'CATERER', 'PHOTOGRAPHER', 'DECORATOR', 'MAKEUP_ARTIST', 'DJ', 'TRANSPORT', 'FLORIST', 'WEDDING_PLANNER', 'OTHER']),
            description: zod_1.z.string().min(10),
            location: zod_1.z.string().min(2),
            phone: zod_1.z.string().min(10),
            email: zod_1.z.string().email(),
            website: zod_1.z.string().url().optional(),
            experience: zod_1.z.number().min(0).optional(),
            basePrice: zod_1.z.number().positive().optional(),
            priceRange: zod_1.z.string().optional()
        })
    }),
    createBooking: zod_1.z.object({
        body: zod_1.z.object({
            vendorId: zod_1.z.string(),
            serviceId: zod_1.z.string(),
            eventDate: zod_1.z.string().datetime(),
            eventTime: zod_1.z.string(),
            eventDuration: zod_1.z.number().positive(),
            guestCount: zod_1.z.number().positive().optional(),
            location: zod_1.z.string().optional(),
            specialRequests: zod_1.z.string().optional()
        })
    }),
    updateBookingStatus: zod_1.z.object({
        body: zod_1.z.object({
            status: zod_1.z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'])
        })
    }),
    createMessage: zod_1.z.object({
        body: zod_1.z.object({
            receiverId: zod_1.z.string(),
            content: zod_1.z.string().min(1),
            messageType: zod_1.z.string().default('text'),
            attachments: zod_1.z.array(zod_1.z.string()).optional()
        })
    }),
    createReview: zod_1.z.object({
        body: zod_1.z.object({
            vendorId: zod_1.z.string(),
            rating: zod_1.z.number().min(1).max(5),
            comment: zod_1.z.string().optional()
        })
    })
};
//# sourceMappingURL=validation.js.map