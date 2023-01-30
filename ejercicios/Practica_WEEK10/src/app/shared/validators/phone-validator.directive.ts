import { Directive } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[fsPhoneValidator]',
  standalone: true,
})
export class PhoneValidatorDirective {
  constructor() {}
  static validPhoneNumber(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valid = /^\d{9}$/.test(control.value);
      return valid ? null : { invalidPhoneNumber: { value: control.value } };
    };
  }
}
