import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map } from "rxjs";
import { AuthService } from "../auth/auth-service";
@Injectable({
  providedIn: 'root'
})
export class LogoutActivateGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.isLogged().pipe(
        map(isLoggedIn => {
          if (isLoggedIn) {
            console.log('logout.guard: `User is logged?:` ' + isLoggedIn);

            this.router.navigate(['/restaurants']);
          }
          return !isLoggedIn;
        })
      );
      /*
      console.log('logout.guard');

      const isLoggedOut = !this.authService.isLogged();
      if (!isLoggedOut) {
        this.router.navigate(['/restaurants']);
      }
      return isLoggedOut;
      */
  }
}

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
