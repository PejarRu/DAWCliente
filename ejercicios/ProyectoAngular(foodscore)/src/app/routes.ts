import { Routes } from '@angular/router';
import { LoginActivateGuard } from './guards/login.guard';
import { LogoutActivateGuard } from './guards/logout.guard';

export const APP_ROUTES: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth-routes').then(
        (m) => m.AUTH_ROUTES
      ),
    canActivate: [LogoutActivateGuard],
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./users/users-routes').then(
        (m) => m.USERS_ROUTES
      ),
    canActivate: [LoginActivateGuard],
  },
    {
    path: 'restaurants',
    loadChildren: () =>
      import('./restaurants/restaurants-routes').then(
        (m) => m.RESTAURANTS_ROUTES
      ),
    canActivate: [LoginActivateGuard],
  },
  {
    // EMPTY ROUTE (DEFAULT) WILL REDIRECT TO /auth/login PAGE
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    // IF ROUTE DOES NOT MATCH ANY ABOVE, REDIRECT TO /auth/login
    path: '**',
    redirectTo: 'auth/login',
  },
];
