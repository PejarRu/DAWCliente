import { Directive } from '@angular/core';
import { AbstractControl, FormGroup, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[passwordConfirm]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: PasswordConfirmingValidatior, multi: true }]
})

export class PasswordConfirmingValidatior implements Validator {

  validate(group: FormGroup): ValidationErrors | null {

    const passwordControl = group.get('password');
    const passwordRepControl = group.get('passwordRep');

    if (
      passwordControl &&
      passwordRepControl &&
      passwordControl.value !== passwordRepControl.value
      ) {

      passwordRepControl.setErrors(
        { 'passwordConfirm': true }
      );

      return { 'passwordConfirm': true };
    }
    return null;
  }

}
export const passwordMatchingValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { notmatched: true };
};
