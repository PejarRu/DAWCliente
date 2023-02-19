import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const id = +next.params['id'];
      if (isNaN(id) || id < 1) {
        return this.router.parseUrl('/users/me');
      }
    return true;
  }
}

/*
export const usersIdGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  // return STATEMENT DIRECTLY RETURNS A BOOLEAN VALUE. IF WE NEED TO RERUN AN OBSERVABLE WE SHOULD SPECIFY
  const id = +route.params['id'];

  if (isNaN(id) || id < 1) {
    return inject(Router).createUrlTree(['/users']);
  }
  return true;
};
*/
