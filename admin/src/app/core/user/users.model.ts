import { User } from "./user.class";

export interface UsersPayload {
  rows: User[];
  total: number;
}
