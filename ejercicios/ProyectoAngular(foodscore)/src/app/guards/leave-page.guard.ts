import { CanDeactivateFn, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

// CREATE A COMPONENT INTERFACE TO CanDeactivate TO BE ABLE TO USE Leave-Guard IN MORE THAN ONE COMPONENT
export interface CanDeactivateComponent {
  canDeactivate():
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree;
}

export const leavePageGuard: CanDeactivateFn<CanDeactivateComponent> = (
  component
  ) => {
    return component.canDeactivate? component.canDeactivate() : true;
/*
    //Creating angular material Dialog Menu
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Do you want to leave this page?. Changes can be lost',
        confirmText: 'Leave',
        cancelText: 'Stay'
      }
    });

    return component.canDeactivate ?
    component.canDeactivate() :
    dialogRef.afterClosed();
    /**/
};
