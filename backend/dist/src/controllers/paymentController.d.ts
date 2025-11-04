import { Request, Response } from 'express';
export declare class PaymentController {
    static createPaymentIntent: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static confirmPayment: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static getPaymentHistory: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static processRefund: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static handleStripeWebhook: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
}
//# sourceMappingURL=paymentController.d.ts.map