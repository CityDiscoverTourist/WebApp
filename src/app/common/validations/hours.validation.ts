import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';

export function hourValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    var con = control.value.toLowerCase().trim().toString();
    var regexTime1 = '/^(?=D*d).{7,8,9}$/';
    var regexTime2 = '/^(?=D*d).{10,11,12,13,14,15,16,17,18}$/';
    var regexTime3 = '/^(?=D*d).{8,9,10,11,12,13,14,15,16,17,18}$/';

    var removeWhiteSpace = con.replace(/\s/g, '');
    var newarr = removeWhiteSpace.toLowerCase().split('-');

    var splitAM = removeWhiteSpace.split('am');
    if (con.charAt(0).startsWith(0)) {
      var check = false;
      if (!regexTime1.match(con.charAt(1))) {
        return of({ format789: true });
      }
      if (con.charAt(1) != '') {
        var w1 = con.charAt(2);
        if (':' != con.charAt(2)) {
          return of({ formatColon: true });
        }
        var a1 = removeWhiteSpace.charAt(3);
        var a2 = removeWhiteSpace.charAt(4);
        if (Number(a1 + a1) > 59) {
          return of({ formatSecond59: true });
        }
        var typeAM = removeWhiteSpace.charAt(5) + removeWhiteSpace.charAt(6);
        if (typeAM != 'am') {
          return of({ formatAM: true });
        }
        var a1 = removeWhiteSpace.charAt(7);
        if (removeWhiteSpace.charAt(7) != '-') {
          return of({ formatHorizontalConflict: true });
        }

        var colseTime = removeWhiteSpace.charAt(8) + removeWhiteSpace.charAt(9);
        if (!regexTime3.match(colseTime)) {
          return of({ formatCloseTime: true });
        }

        if (':' != removeWhiteSpace.charAt(10)) {
          return of({ formatColon: true });
        }
        var a11 = removeWhiteSpace.charAt(11);
        var a12 = removeWhiteSpace.charAt(12);
        if (Number(a11 + a12) > 59) {
          return of({ formatSecond59: true });
        }
        var typePM = removeWhiteSpace.charAt(13) + removeWhiteSpace.charAt(14);
        if (typePM != 'pm') {
          return of({ formatPM: true });
        }
      }
    }
    return of({});
  };
}
