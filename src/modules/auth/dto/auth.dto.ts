export interface LoginDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterDto {
  userType: 'user';
  name?: string;
  username?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  bio?: string;
  phone?: string;
}

export interface RegisterStaffDto {
  userType: 'staff';
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  bio?: string;
  role: 'ADMIN' | 'HOST' | 'CO_HOST' | 'PRODUCER' | 'SOUND_ENGINEER' | 'CONTENT_MANAGER' | 'TECHNICAL_SUPPORT';
  department?: string;
  position?: string;
  phone?: string;
  address?: string;
  emergencyContact?: string;
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