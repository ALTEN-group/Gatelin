export interface LoginDtoIn {
  email: string;
  pwd: string;
}

export interface LoginResponse {
  nickname: string;
  accessToken: string;
  refreshToken: string;
  rolesArrayAgg: number[];
}
