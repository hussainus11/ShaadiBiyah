import { Request, Response } from 'express';
export declare class BookingController {
    static createBooking: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static getUserBookings: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static getVendorBookings: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static getBooking: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static updateBooking: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static cancelBooking: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static updateBookingStatus: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
}
//# sourceMappingURL=bookingController.d.ts.map