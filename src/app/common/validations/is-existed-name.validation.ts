import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { map, Observable, of } from 'rxjs';
import { CityService } from 'src/app/services';

export function isExistedNameValidatorCity(
  cityService: CityService,
  value: string
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (value === 'Cập nhật') return of(null);
    return cityService.checkNameExisted(control.value).pipe(
      map((result: boolean) => {
        return result ? { nameAlreadyExists: true } : null;
      })
    );
  };
}
