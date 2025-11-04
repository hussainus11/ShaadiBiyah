import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
export declare const validateRequest: (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const schemas: {
    register: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodString;
            password: z.ZodString;
            firstName: z.ZodString;
            lastName: z.ZodString;
            phone: z.ZodOptional<z.ZodString>;
            role: z.ZodOptional<z.ZodEnum<["USER", "VENDOR"]>>;
        }, "strip", z.ZodTypeAny, {
            email: string;
            password: string;
            firstName: string;
            lastName: string;
            phone?: string | undefined;
            role?: "USER" | "VENDOR" | undefined;
        }, {
            email: string;
            password: string;
            firstName: string;
            lastName: string;
            phone?: string | undefined;
            role?: "USER" | "VENDOR" | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            email: string;
            password: string;
            firstName: string;
            lastName: string;
            phone?: string | undefined;
            role?: "USER" | "VENDOR" | undefined;
        };
    }, {
        body: {
            email: string;
            password: string;
            firstName: string;
            lastName: string;
            phone?: string | undefined;
            role?: "USER" | "VENDOR" | undefined;
        };
    }>;
    login: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodString;
            password: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            email: string;
            password: string;
        }, {
            email: string;
            password: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            email: string;
            password: string;
        };
    }, {
        body: {
            email: string;
            password: string;
        };
    }>;
    updateProfile: z.ZodObject<{
        body: z.ZodObject<{
            firstName: z.ZodOptional<z.ZodString>;
            lastName: z.ZodOptional<z.ZodString>;
            phone: z.ZodOptional<z.ZodString>;
            weddingDate: z.ZodOptional<z.ZodString>;
            budget: z.ZodOptional<z.ZodNumber>;
            location: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            firstName?: string | undefined;
            lastName?: string | undefined;
            phone?: string | undefined;
            weddingDate?: string | undefined;
            budget?: number | undefined;
            location?: string | undefined;
        }, {
            firstName?: string | undefined;
            lastName?: string | undefined;
            phone?: string | undefined;
            weddingDate?: string | undefined;
            budget?: number | undefined;
            location?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            firstName?: string | undefined;
            lastName?: string | undefined;
            phone?: string | undefined;
            weddingDate?: string | undefined;
            budget?: number | undefined;
            location?: string | undefined;
        };
    }, {
        body: {
            firstName?: string | undefined;
            lastName?: string | undefined;
            phone?: string | undefined;
            weddingDate?: string | undefined;
            budget?: number | undefined;
            location?: string | undefined;
        };
    }>;
    vendorRegistration: z.ZodObject<{
        body: z.ZodObject<{
            businessName: z.ZodString;
            category: z.ZodEnum<["VENUE", "CATERER", "PHOTOGRAPHER", "DECORATOR", "MAKEUP_ARTIST", "DJ", "TRANSPORT", "FLORIST", "WEDDING_PLANNER", "OTHER"]>;
            description: z.ZodString;
            location: z.ZodString;
            phone: z.ZodString;
            email: z.ZodString;
            website: z.ZodOptional<z.ZodString>;
            experience: z.ZodOptional<z.ZodNumber>;
            basePrice: z.ZodOptional<z.ZodNumber>;
            priceRange: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            email: string;
            phone: string;
            location: string;
            businessName: string;
            category: "VENUE" | "CATERER" | "PHOTOGRAPHER" | "DECORATOR" | "MAKEUP_ARTIST" | "DJ" | "TRANSPORT" | "FLORIST" | "WEDDING_PLANNER" | "OTHER";
            description: string;
            website?: string | undefined;
            experience?: number | undefined;
            basePrice?: number | undefined;
            priceRange?: string | undefined;
        }, {
            email: string;
            phone: string;
            location: string;
            businessName: string;
            category: "VENUE" | "CATERER" | "PHOTOGRAPHER" | "DECORATOR" | "MAKEUP_ARTIST" | "DJ" | "TRANSPORT" | "FLORIST" | "WEDDING_PLANNER" | "OTHER";
            description: string;
            website?: string | undefined;
            experience?: number | undefined;
            basePrice?: number | undefined;
            priceRange?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            email: string;
            phone: string;
            location: string;
            businessName: string;
            category: "VENUE" | "CATERER" | "PHOTOGRAPHER" | "DECORATOR" | "MAKEUP_ARTIST" | "DJ" | "TRANSPORT" | "FLORIST" | "WEDDING_PLANNER" | "OTHER";
            description: string;
            website?: string | undefined;
            experience?: number | undefined;
            basePrice?: number | undefined;
            priceRange?: string | undefined;
        };
    }, {
        body: {
            email: string;
            phone: string;
            location: string;
            businessName: string;
            category: "VENUE" | "CATERER" | "PHOTOGRAPHER" | "DECORATOR" | "MAKEUP_ARTIST" | "DJ" | "TRANSPORT" | "FLORIST" | "WEDDING_PLANNER" | "OTHER";
            description: string;
            website?: string | undefined;
            experience?: number | undefined;
            basePrice?: number | undefined;
            priceRange?: string | undefined;
        };
    }>;
    createBooking: z.ZodObject<{
        body: z.ZodObject<{
            vendorId: z.ZodString;
            serviceId: z.ZodString;
            eventDate: z.ZodString;
            eventTime: z.ZodString;
            eventDuration: z.ZodNumber;
            guestCount: z.ZodOptional<z.ZodNumber>;
            location: z.ZodOptional<z.ZodString>;
            specialRequests: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            vendorId: string;
            serviceId: string;
            eventDate: string;
            eventTime: string;
            eventDuration: number;
            location?: string | undefined;
            guestCount?: number | undefined;
            specialRequests?: string | undefined;
        }, {
            vendorId: string;
            serviceId: string;
            eventDate: string;
            eventTime: string;
            eventDuration: number;
            location?: string | undefined;
            guestCount?: number | undefined;
            specialRequests?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            vendorId: string;
            serviceId: string;
            eventDate: string;
            eventTime: string;
            eventDuration: number;
            location?: string | undefined;
            guestCount?: number | undefined;
            specialRequests?: string | undefined;
        };
    }, {
        body: {
            vendorId: string;
            serviceId: string;
            eventDate: string;
            eventTime: string;
            eventDuration: number;
            location?: string | undefined;
            guestCount?: number | undefined;
            specialRequests?: string | undefined;
        };
    }>;
    updateBookingStatus: z.ZodObject<{
        body: z.ZodObject<{
            status: z.ZodEnum<["PENDING", "APPROVED", "REJECTED", "CONFIRMED", "COMPLETED", "CANCELLED"]>;
        }, "strip", z.ZodTypeAny, {
            status: "PENDING" | "APPROVED" | "REJECTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
        }, {
            status: "PENDING" | "APPROVED" | "REJECTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            status: "PENDING" | "APPROVED" | "REJECTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
        };
    }, {
        body: {
            status: "PENDING" | "APPROVED" | "REJECTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
        };
    }>;
    createMessage: z.ZodObject<{
        body: z.ZodObject<{
            receiverId: z.ZodString;
            content: z.ZodString;
            messageType: z.ZodDefault<z.ZodString>;
            attachments: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            receiverId: string;
            content: string;
            messageType: string;
            attachments?: string[] | undefined;
        }, {
            receiverId: string;
            content: string;
            attachments?: string[] | undefined;
            messageType?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            receiverId: string;
            content: string;
            messageType: string;
            attachments?: string[] | undefined;
        };
    }, {
        body: {
            receiverId: string;
            content: string;
            attachments?: string[] | undefined;
            messageType?: string | undefined;
        };
    }>;
    createReview: z.ZodObject<{
        body: z.ZodObject<{
            vendorId: z.ZodString;
            rating: z.ZodNumber;
            comment: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            vendorId: string;
            rating: number;
            comment?: string | undefined;
        }, {
            vendorId: string;
            rating: number;
            comment?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            vendorId: string;
            rating: number;
            comment?: string | undefined;
        };
    }, {
        body: {
            vendorId: string;
            rating: number;
            comment?: string | undefined;
        };
    }>;
};
//# sourceMappingURL=validation.d.ts.map