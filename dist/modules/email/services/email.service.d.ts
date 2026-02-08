export declare class EmailService {
    private transporter;
    constructor();
    sendVerificationEmail(email: string, token: string, name: string): Promise<void>;
    sendPasswordResetEmail(email: string, token: string, name: string): Promise<void>;
    sendWelcomeEmail(email: string, name: string): Promise<void>;
    sendStaffRegistrationEmail(email: string, name: string, role: string): Promise<void>;
    private getVerificationEmailTemplate;
    private getPasswordResetEmailTemplate;
    private getWelcomeEmailTemplate;
    private getStaffRegistrationEmailTemplate;
}
//# sourceMappingURL=email.service.d.ts.map