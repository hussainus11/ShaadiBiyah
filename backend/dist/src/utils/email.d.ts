interface EmailOptions {
    email: string;
    subject: string;
    template: string;
    data: any;
}
export declare const sendEmail: ({ email, subject, template, data }: EmailOptions) => Promise<void>;
export {};
//# sourceMappingURL=email.d.ts.map