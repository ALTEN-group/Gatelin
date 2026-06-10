import { inject } from "@angular/core";
import { TokenService } from "@core/auth/token.service";
import { cloneReq } from "@core/interceptors/clone-req";
export const authInterceptor = (req, next) => {
    const tokenService = inject(TokenService);
    const token = tokenService.getAccessToken();
    if (!token) {
        return next(req);
    }
    return next(cloneReq(req, token));
};
//# sourceMappingURL=auth.interceptor.js.map