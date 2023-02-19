import { HttpInterceptorFn } from "@angular/common/http";
import { SERVER } from "../shared/constants";

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  let serverUrl = SERVER;

  const reqClone = req.clone({
    url: `${serverUrl}/${req.url}`,
  });
  return next(reqClone);
};
