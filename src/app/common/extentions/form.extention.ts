import { FormArray, FormControl, FormGroup } from '@angular/forms';

declare module '@angular/forms' {
  interface FormGroup {
    revalidateControls(keys: string[]): void;
    hasError(key: string): boolean;
    hasErrorOf(key: string, validationType: string): boolean;
    hasValue(key: string): boolean;
  }
}
FormGroup.prototype.revalidateControls = function (keys: string[] = []): void {
  const form = this as FormGroup;
  if (!keys?.length) {
    keys = Object.keys(form.controls);
  }

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
    ? control.errors[validationType]
    : false;
};

FormGroup.prototype.hasValue = function (key: string): boolean {
  const form = this as FormGroup;
  const control = form.get(key)?.value;
  if (control.length > 0) return true;
  return false;
};
