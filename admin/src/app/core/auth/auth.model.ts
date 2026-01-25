import { RolesPayload } from "@core/roles/role.model";
import { User } from "@core/user/user.class";

export interface LoginPayload {
  user: User;
  token: string;
  roles: RolesPayload;
}

export interface TokenPayload {
  user: User;
  roles: RolesPayload;
}
