export interface UserData {
  fullName: string;
  email: string;
  expiryDate: Date;
}

export interface UpdatePassword {
  username: string;
  oldPassword: string;
  newPassword: string;
}