import { Request, Response } from 'express';
export declare class AdminController {
    static getDashboard: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static getUsers: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static updateUserStatus: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static deleteUser: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static getVendors: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static approveVendor: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static rejectVendor: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static getAllBookings: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static updateBookingStatus: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static getAnalyticsOverview: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static getRevenueAnalytics: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static getUserAnalytics: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
}
//# sourceMappingURL=adminController.d.ts.map