import { ValidatorFn, FormGroup, ValidationErrors } from "@angular/forms";

/** Password Must Match the Confirmation Password */

export const passwordValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('password');
  const cpassword = control.get('cpassword');

  return password && cpassword && password.value !== cpassword.value ? { 'passwordMismatch': true } : null;
};