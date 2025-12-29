export interface UserDto {
  name?: string;
  username?: string;
  profileImage?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}