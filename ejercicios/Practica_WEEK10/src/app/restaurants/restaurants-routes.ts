import { Routes } from '@angular/router';

import { leavePageGuard } from '../guards/leave-page.guard';
import { restaurantIdGuard } from './restaurant-id.guard';

import { restaurantResolver } from './resolvers/restaurant.resolver';

import { RestaurantDetailsComponent } from './restaurant-details/restaurant-details.component';
import { RestaurantFormComponent } from './restaurant-form/restaurant-form.component';
import { RestaurantsPageComponent } from './restaurants-page/restaurants-page.component';

export const RESTAURANTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./restaurants-page/restaurants-page.component').then(
        (m) => m.RestaurantsPageComponent
      ),
  },
  {
    path: 'add',
    canDeactivate: [leavePageGuard],
    loadComponent: () =>
      import('./restaurant-form/restaurant-form.component').then(
        (m) => m.RestaurantFormComponent
      ),
  },
  {
    path: ':id',
    canActivate: [restaurantIdGuard],
    resolve: {
      restaurant: restaurantResolver,
    },
    loadComponent: () =>
      import('./restaurant-details/restaurant-details.component').then(
        (m) => m.RestaurantDetailsComponent
      ),
  },
  /*
  {
    path: ':id/edit',
    canActivate: [restaurantIdGuard],
    canDeactivate: [leavePageGuard],
    resolve: {
      restaurant: restaurantResolver,
    },
    component: RestaurantFormComponent,
  },
  */
];
