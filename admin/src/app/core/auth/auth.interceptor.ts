import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { TokenService } from "@core/auth/token.service";
import { cloneReq } from "@core/interceptors/clone-req";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getAccessToken();
  if (!token) {
    return next(req);
  }
  return next(cloneReq(req, token));
};
