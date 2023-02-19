import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');

  if (token) {

    // Clone the request to add the new header.
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token),
    });
    // Pass on the cloned request instead of the original request.
    return next(authReq);
  }
  console.log(next(req));

  return next(req);
};

/*
export const authInterceptor: HttpInterceptorFn = (req, next) => {
 const authService = new AuthService();
 const token = authService.getToken();

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
*/
