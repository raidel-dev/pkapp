import { FormGroup, FormArray, AbstractControl } from "@angular/forms";
import { AppStateServiceProvider } from "../providers/app-state/app-state-service";

export class AbstractPageForm {
  constructor(public appStateService: AppStateServiceProvider) { }

  public setTouched(form: FormGroup): void {
    for (let control in form.controls) {
      form.controls[control].markAsTouched();

      if (form.controls[control] instanceof FormArray) {
        const formArray = form.controls[control] as FormArray;
        for (let item in formArray.controls) {
          this.setTouched(formArray.controls[item] as FormGroup);
        }
      }
    }
    form.markAsTouched();
  }

  public resetTouched(form: FormGroup): void {
    for (let control in form.controls) {
      form.controls[control].markAsPristine();
      form.controls[control].markAsUntouched();
      form.controls[control].updateValueAndValidity();

      if (form.controls[control] instanceof FormArray) {
        const formArray = form.controls[control] as FormArray;
        for (let item in formArray.controls) {
          this.resetTouched(formArray.controls[item] as FormGroup);
        }
      }
    }
    form.markAsPristine();
    form.markAsUntouched();
    form.updateValueAndValidity();
  }

  public isIos(): boolean {
    return this.appStateService.isIos();
  }
}