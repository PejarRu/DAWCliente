import { Routes } from '@angular/router';

import { LoginPageComponent } from './login/login.component';
import { LoginActivateGuard } from '../guards/login.guard';
import { LogoutActivateGuard } from '../guards/logout.guard';
import { leavePageGuard } from '../guards/leave-page.guard';
import { RegisterPageComponent } from './register-page/register-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { userResolver } from './profile-page/resolvers/user.resolver';

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
  {
    path: 'profile',
    canActivate: [LoginActivateGuard],
    component: ProfilePageComponent,
    resolve: {
      user: userResolver,
    },
  },
  {
    path: 'profile/edit',
    canActivate: [LoginActivateGuard],
    component: ProfilePageComponent,
    resolve: {
      user: userResolver,
    },
  },
  {
    path: 'profile/:id',
    canActivate: [LoginActivateGuard],
    component: ProfilePageComponent,
    resolve: {
      user: userResolver,
    },
  },

];
