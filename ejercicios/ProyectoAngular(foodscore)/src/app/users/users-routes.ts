import { Routes } from '@angular/router';

import { LoginActivateGuard } from '../guards/login.guard';
import { leavePageGuard } from '../guards/leave-page.guard';
import { userResolver } from './resolvers/user.resolver';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { UsersGuard } from './users-id.guard';

export const USERS_ROUTES: Routes = [
  /*
  {
    path: 'me', loadComponent: () =>
    import('./profile-page/profile-page.component').then(
      (m) => m.ProfilePageComponent
    ),
    canActivate: [LoginActivateGuard],
    resolve: {
      user: userResolver,
    },
  },
  */
  {
    path: 'me',
    canDeactivate: [leavePageGuard],
    canActivate: [LoginActivateGuard,
      //UsersGuard
    ],
    component: ProfilePageComponent
  },
  {
    path: 'edit', loadComponent: () =>
    import('./profile-page/profile-form/profile-form.component').then(
      (m) => m.ProfileFormComponent
    ),
    canActivate: [LoginActivateGuard, //UsersGuard
  ],
    canDeactivate: [leavePageGuard],
    resolve: {
      user: userResolver,
    },
  },
  {
    path: ':id', loadComponent: () =>
    import('./profile-page/profile-page.component').then(
      (m) => m.ProfilePageComponent
    ),
    canActivate: [LoginActivateGuard, //UsersGuard
  ],
    resolve: {
      user: userResolver,
    },
  },
];
