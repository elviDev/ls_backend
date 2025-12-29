export interface LoginDto {
    email: string;
    password: string;
    rememberMe?: boolean;
}
export interface RegisterDto {
    firstName?: string;
    lastName?: string;
    name?: string;
    username?: string;
    email: string;
    password: string;
    confirmPassword?: string;
    phone?: string;
}
export interface RegisterStaffDto {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword?: string;
    phone?: string;
    role: string;
}
export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name?: string;
        role: string;
        userType: 'user' | 'staff';
        isApproved?: boolean;
        firstName?: string;
        lastName?: string;
    };
}
//# sourceMappingURL=auth.dto.d.ts.map