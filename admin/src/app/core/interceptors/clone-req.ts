import { HttpRequest } from "@angular/common/http";

export function cloneReq(req: HttpRequest<unknown>, token: string) {
  const clonedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
  return clonedReq;
}
