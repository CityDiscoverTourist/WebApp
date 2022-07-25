import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { map, Observable, of } from 'rxjs';
import {
  AreaService,
  CityService,
  LocationService,
  LocationtypeService,
} from 'src/app/services';

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
export function isExistedNameValidatorArea(
  areaSerice: AreaService,
  value: string
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (value === 'Cập nhật') return of(null);
    return areaSerice.checkNameExisted(control.value).pipe(
      map((result: boolean) => {
        return result ? { nameAlreadyExists: true } : null;
      })
    );
  };
}

export function isExistedNameValidatorLocationType(
  locationTypeSerice: LocationtypeService,
  value: string
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (value === 'Cập nhật') return of(null);
    return locationTypeSerice.checkNameExisted(control.value).pipe(
      map((result: boolean) => {
        return result ? { nameAlreadyExists: true } : null;
      })
    );
  };
}
export function isExistedNameValidatorLocation(
  locationSerice: LocationService,
  value: string
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (value === 'Cập nhật') return of(null);
    return locationSerice.checkNameExisted(control.value).pipe(
      map((result: boolean) => {
        return result ? { nameAlreadyExists: true } : null;
      })
    );
  };
}
