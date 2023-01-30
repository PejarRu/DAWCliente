import { CanActivateFn, ActivatedRouteSnapshot, Router } from "@angular/router";
import { inject } from "@angular/core";


export const restaurantIdGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot 
) => { 
  // return STATEMENT DIRECTLY RETURNS A BOOLEAN VALUE. IF WE NEED TO RERUN AN OBSERVABLE WE SHOULD SPECIFY
  const id = +route.params['id']; 

  if (isNaN(id) || id < 1) { 
    return inject(Router).createUrlTree(['/restaurants']); 
  }
  return true; 
};
