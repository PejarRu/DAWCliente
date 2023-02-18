import { Directive } from '@angular/core';
import { FormGroup, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[emailMatch]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: EmailMatchValidator, multi: true }]
})

export class EmailMatchValidator implements Validator {

  validate(group: FormGroup): ValidationErrors | null {

    const emailControl = group.get('email');
    const emailRepControl = group.get('emailRep');

    if (
      emailControl &&
      emailRepControl &&
      emailControl.value !== emailRepControl.value
    ) {

      emailRepControl.setErrors(
        { 'emailMatch': true }
      );

      return { 'emailMatch': true };
    }
    return null;
  }

}
import { ValidatorFn, AbstractControl } from '@angular/forms';

export const emailMatchValidator: ValidatorFn =
  (control: AbstractControl): { [key: string]: any } | null => {
    const email = control.get('email')?.value;
    const emailRep = control.get('emailRep')?.value;
    if (email !== emailRep) {
      return { emailMatch: true };
    }
    return null;
  };


