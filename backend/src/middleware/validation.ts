import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validateRequest = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        console.log('Validation middleware - Request body:', req.body);
        schema.parse({
          body: req.body,
          query: req.query,
          params: req.params
        });
        console.log('Validation passed');
        return next(); // ✅ ensure return here
      } catch (error) {
        console.log('Validation failed:', error);
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message
            }))
          });
        }
        return next(error); // ✅ ensure return here
      }
    };
  };
  

// Common validation schemas
export const schemas = {
  register: z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(6),
      firstName: z.string().min(2),
      lastName: z.string().min(2),
      phone: z.string().optional(),
      role: z.enum(['USER', 'VENDOR']).optional()
    })
  }),

  login: z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(1)
    })
  }),

  updateProfile: z.object({
    body: z.object({
      firstName: z.string().min(2).optional(),
      lastName: z.string().min(2).optional(),
      phone: z.string().optional(),
      weddingDate: z.string().datetime().optional(),
      budget: z.number().positive().optional(),
      location: z.string().optional()
    })
  }),

  vendorRegistration: z.object({
    body: z.object({
      businessName: z.string().min(2),
      category: z.enum(['VENUE', 'CATERER', 'PHOTOGRAPHER', 'DECORATOR', 'MAKEUP_ARTIST', 'DJ', 'TRANSPORT', 'FLORIST', 'WEDDING_PLANNER', 'OTHER']),
      description: z.string().min(10),
      location: z.string().min(2),
      phone: z.string().min(10),
      email: z.string().email(),
      website: z.string().url().optional(),
      experience: z.number().min(0).optional(),
      basePrice: z.number().positive().optional(),
      priceRange: z.string().optional()
    })
  }),

  createBooking: z.object({
    body: z.object({
      vendorId: z.string(),
      serviceId: z.string(),
      eventDate: z.string().datetime(),
      eventTime: z.string(),
      eventDuration: z.number().positive(),
      guestCount: z.number().positive().optional(),
      location: z.string().optional(),
      specialRequests: z.string().optional()
    })
  }),

  updateBookingStatus: z.object({
    body: z.object({
      status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'])
    })
  }),

  createMessage: z.object({
    body: z.object({
      receiverId: z.string(),
      content: z.string().min(1),
      messageType: z.string().default('text'),
      attachments: z.array(z.string()).optional()
    })
  }),

  createReview: z.object({
    body: z.object({
      vendorId: z.string(),
      rating: z.number().min(1).max(5),
      comment: z.string().optional()
    })
  })
};




