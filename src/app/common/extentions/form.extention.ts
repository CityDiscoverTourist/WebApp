import {
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

declare module '@angular/forms' {
  interface FormGroup {
    revalidateControls(keys: string[]): void;
    hasError(key: string): boolean;
    hasErrorOf(key: string, validationType: string): boolean;
    //   revalidateControls(): void;
    //   hasError(key: string): boolean;
    //   hasErrorOf(key: string, validationType: string): ValidationErrors;
  }
}
FormGroup.prototype.revalidateControls = function (keys: string[] = []): void {
  //   FormGroup.prototype.revalidateControls = function (): void {
  const form = this as FormGroup;
  if (!keys?.length) {
    keys = Object.keys(form.controls);
    // keys = Object.keys(form);
  }
  // const keys= Object.keys(form.controls);
  if (!keys.length) {
    return;
  }
  for (let key of keys) {
    const control = form.get(key);
    if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormArray) {
      //mark array as touched
      const arr = control as FormArray;
      for (let fc of arr.controls) {
        (fc as FormGroup).revalidateControls([]);
      }
    } else if (control instanceof FormGroup) {
      control.revalidateControls([]);
    }
  }
};
FormGroup.prototype.hasError = function (key: string): boolean {
  const form = this as FormGroup;
  const control = form.get(key);
  if (!control) {
    throw new Error(`No control found under name ${key}`);
  }
  return control.invalid && (control.dirty || control.touched);
  //   ?control.errors:null;
};

FormGroup.prototype.hasErrorOf = function (
  key: string,
  validationType: string
): boolean {
  const form = this as FormGroup;
  const control = form.get(key);
  if (!control) {
    throw new Error(`No control found under name ${key}`);
  }
  return control.errors && control.invalid && (control.dirty || control.touched)
    // ? control.errors[validationType.toLowerCase()]
    ? control.errors[validationType]
    : false;
};