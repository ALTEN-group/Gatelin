export interface Permission {
  route: number;
  operations: number[];
  fields: string[];
}

export interface LoginDtoIn {
  email: string;
  pwd: string;
}

export interface SessionResponse {
  accessToken: string;
  permissions: Permission[];
}
