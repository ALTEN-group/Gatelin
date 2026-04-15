import { Permission } from "@core/roles/role.class";

export interface LoginDtoIn {
  email: string;
  pwd: string;
}

export interface LoginResponse {
  nickname: string;
  firstName: string;
  lastName: string;
  accessToken: string;
  refreshToken: string;
  roles: number[];
  permissions: Permission[];
}
