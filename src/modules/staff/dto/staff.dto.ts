export interface StaffDto {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: string;
  department?: string;
  position?: string;
  phone?: string;
  address?: string;
  emergencyContact?: string;
  startDate?: Date;
  salary?: number;
  bio?: string;
}

export interface StaffUpdateDto {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  role?: string;
  department?: string;
  position?: string;
  phone?: string;
  address?: string;
  emergencyContact?: string;
  startDate?: Date;
  salary?: number;
  bio?: string;
  isActive?: boolean;
  isApproved?: boolean;
}

export interface StaffQueryDto {
  role?: string;
  department?: string;
  search?: string;
  isActive?: boolean | string;
  isApproved?: boolean | string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  perPage?: number;
}