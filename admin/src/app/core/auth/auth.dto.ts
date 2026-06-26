export interface Permission {
  route: number;
  operation: number[];
  fields: string[];
}

export interface LoginDtoIn {
  email: string;
  pwd: string;
}

export interface SessionResponse {
  accessToken: string;
  refreshToken: string;
  permissions: Permission[];
}
