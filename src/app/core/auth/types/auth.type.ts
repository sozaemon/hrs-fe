export interface LoginRequest {
  userName: string;
  password: string;
  role?: string;
}

export interface Role {
  name: string;
  code: string;
  description: string;
}

export interface TokenResponse {
  token?: string;
  refreshToken?: string;
}

export interface Permission {
  id?: number;
  roleCode: string;
  permission: string;
}
