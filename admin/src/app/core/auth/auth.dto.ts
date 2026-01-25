export interface LoginDtoIn {
  email: string;
  pwd: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}
