import { LoginDto, RegisterDto, RegisterStaffDto, AuthResponse } from "../dto/auth.dto";
export declare class AuthService {
    login(loginData: LoginDto): Promise<AuthResponse>;
    register(registerData: RegisterDto): Promise<{
        message: string;
    }>;
    registerStaff(registerData: RegisterStaffDto): Promise<{
        message: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    private generateToken;
}
//# sourceMappingURL=auth.service.d.ts.map