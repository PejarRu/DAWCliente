import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth-routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'restaurants',
    loadChildren: () =>
      import('./restaurants/restaurants-routes').then(
        (m) => m.RESTAURANTS_ROUTES
      ),
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
