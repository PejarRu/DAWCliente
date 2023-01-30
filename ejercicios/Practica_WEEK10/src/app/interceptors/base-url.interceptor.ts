import { HttpInterceptorFn } from "@angular/common/http";

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  let serverUrl = 'http://arturober.com:5007';

  const reqClone = req.clone({
    url: `${serverUrl}/${req.url}`,
  });
  return next(reqClone);
};
