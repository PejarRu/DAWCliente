import { Routes } from '@angular/router';
import { LogoutActivateGuard } from '../guards/logout.guard';
import { leavePageGuard } from '../guards/leave-page.guard';
import { RegisterPageComponent } from './register-page/register-page.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login', loadComponent: () =>
      import('./login/login.component').then(
        (m) => m.LoginPageComponent
      ),
    canActivate: [LogoutActivateGuard],
  },

  {
    path: 'register',
    canDeactivate: [leavePageGuard],
    canActivate: [LogoutActivateGuard],
    component: RegisterPageComponent
  },
];
