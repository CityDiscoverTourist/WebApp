import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IdValue } from '../models';

@Injectable({
  providedIn: 'root'
})
export class LocationtypeService {

  constructor() { }
  
  getLocationType():Observable<IdValue[]>{
    return of([...Array(6).keys()].map(
      (i) =>
        ({
          id: i,
          value: `${i} id`
        })));
  }
}
