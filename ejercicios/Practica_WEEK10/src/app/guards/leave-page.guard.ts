import { CanDeactivateFn } from "@angular/router";
import { Observable } from "rxjs";

// CREATE A COMPONENT INTERFACE TO CanDeactivate TO BE ABLE TO USE Leave-Guard IN MORE THAN ONE COMPONENT
export interface CanDeactivateComponent {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export const leavePageGuard: CanDeactivateFn<CanDeactivateComponent> = (
  component
  ) => {
    //return confirm('Do you want to leave this page?. Changes can be lost'); 
    return component.canDeactivate? component.canDeactivate() : true;
};
