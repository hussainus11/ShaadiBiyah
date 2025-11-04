import { Request, Response } from 'express';
export declare class AIController {
    static chatWithAI: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static getConversations: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static getConversation: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static deleteConversation: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static suggestVendors: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static createWeddingChecklist: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static estimateBudget: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
    static getTimelineSuggestions: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
}
//# sourceMappingURL=aiController.d.ts.map