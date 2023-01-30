import { Routes } from '@angular/router';

import { LoginPageComponent } from './login/login.component';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginPageComponent },
  /*
  { path: '/register', component: RegisterPageComponent },
  { path: '/my-profile', component: ProfilePageComponent },
  */
];
