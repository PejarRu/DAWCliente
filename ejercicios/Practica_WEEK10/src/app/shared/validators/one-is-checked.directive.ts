import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';

@Directive({
  selector: '[fsOneIsChecked]',
  standalone: true,
  providers: [
    { provide: NG_VALIDATORS, useExisting: OneIsCheckedDirective, multi: true },
  ],
})
export class OneIsCheckedDirective implements Validator {
  constructor() {}

  validate(formGroup: FormGroup) {
    return this.atLeastOneChecked(formGroup);
  }

  atLeastOneChecked(formGroup: FormGroup): ValidationErrors | null {
    const daysControl = formGroup.controls['days'];
    if (!daysControl) {
      return null;
    }

    const selectedDays = Object.keys(daysControl.value).filter(
      (key) => daysControl.value[key]
    ).length;

    return selectedDays > 0 ? null : { atLeastOneChecked: true };
  }

  oneChecked(group: FormGroup) {
    let checked = false;

    Object.keys(group.controls).forEach((key) => {
      const control = group.get(key);
      if (control && control.value === true) {
        checked = true;
      }
    });

    if (checked) {
      return null;
    }

    return { oneChecked: true };
  }
}
