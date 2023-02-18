import { HttpInterceptorFn } from "@angular/common/http";
import { AuthService } from "../auth/auth-service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let authService = new AuthService()
  const token = authService.getToken()

  if (token) {
    // Clone the request to add the new header.
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token),
    });
    // Pass on the cloned request instead of the original request.
    return next(authReq);
  }
  return next(req);
};
