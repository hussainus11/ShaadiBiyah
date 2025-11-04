import { Request, Response } from 'express';
export declare class ChatController {
    static getChatSessions: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static sendMessage: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static getMessages: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static markMessageAsRead: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
}
//# sourceMappingURL=chatController.d.ts.map