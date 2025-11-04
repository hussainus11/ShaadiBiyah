import { Request, Response } from 'express';
export declare class AuthController {
    static register: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static login: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static getMe: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static logout: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static forgotPassword: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static resetPassword: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static verifyEmail: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static changePassword: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
}
//# sourceMappingURL=authController.d.ts.map