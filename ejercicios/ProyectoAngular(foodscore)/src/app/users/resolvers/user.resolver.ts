import { inject } from "@angular/core";
import { ResolveFn, Router } from "@angular/router";
import { catchError, EMPTY, from, of } from "rxjs";
import { UserService } from "../user-service";
import { User } from "src/app/interfaces/user";
import { AuthService } from '../../auth/auth-service';

export const userResolver: ResolveFn<User> = (route, state) => {
  const id = route.params['id'];
  const authService = inject(AuthService);

  return from(id ? authService.getProfile(+id) : authService.getMyProfile())
    .pipe(
      catchError((error) => {
        inject(Router).navigate(['/restaurants']);
        return EMPTY;
      })
    );
};
