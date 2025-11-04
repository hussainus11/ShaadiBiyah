import { Request, Response } from 'express';
export declare const MatrimonialController: {
    getProfiles(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    createProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    toggleInterest(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    setMatch(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    blockProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getMessages(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    sendMessage(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=matrimonialController.d.ts.map