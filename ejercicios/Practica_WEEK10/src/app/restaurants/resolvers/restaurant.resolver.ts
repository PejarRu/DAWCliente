import { inject } from "@angular/core";
import { ResolveFn, Router } from "@angular/router";
import { catchError, EMPTY, of } from "rxjs";

import { Restaurant } from "../interfaces/restaurant";
import { RestaurantsService } from "../services/restaurants.service";

export const restaurantResolver: ResolveFn<Restaurant> = (route, state) => { 
  return inject(RestaurantsService).getRestaurant(+route.params['id'])
    .pipe( 
      catchError((error) => {
        // IF THERE IS AN ERROR, REDIRECT TO /restaurants
        inject(Router).navigate(['/restaurants']); 
        return EMPTY;
      })
    );
};
