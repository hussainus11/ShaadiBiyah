import { Request, Response } from 'express';
export declare class UserController {
    static getProfile: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static updateProfile: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static uploadProfileImage: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static getDashboard: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static getUserBookings: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static getNotifications: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static markNotificationRead: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static createReview: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static getUserReviews: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static getWeddingChecklist: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static createChecklistItem: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static updateChecklistItem: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static deleteChecklistItem: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
}
//# sourceMappingURL=userController.d.ts.map