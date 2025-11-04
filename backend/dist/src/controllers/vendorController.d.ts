import { Request, Response } from 'express';
export declare class VendorController {
    static getVendors: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static getVendor: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static getVendorServices: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static getVendorReviews: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static registerVendor: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static getMyVendorProfile: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static updateVendorProfile: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static createService: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static updateService: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static deleteService: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static getMyBookings: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static updateBookingStatus: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static getVendorAnalytics: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
}
//# sourceMappingURL=vendorController.d.ts.map