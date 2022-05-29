import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function customQuestValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // const invalidPrefix= control.value?.toLowerCase()?.startsWith('test');
      const invalidPrefix= control.value?.toLowerCase()?.startsWith('test');
      return invalidPrefix ? {forbiddenPrefix: true} : null;
    };
  }

  export function customQuestAvailableTimeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const invalid=!control.value;

      
      return {forbiddenPrefix: true};
      //  invalidPrefix ? {forbiddenPrefix: true} : null;
    };
  }