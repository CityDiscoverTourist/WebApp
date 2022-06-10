import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import {
  IdValue,
  LocationCreate,
  LocationCreateResult,
  LocationListItem,
  LocationListSearch,
  Paging,
  Result,
  SearchInfo,
} from '../models';
import { Pagination } from '../models/pagination.model';
import { Location } from '../models';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({ encrypt: 'multipart/form-data' }),
  };

  getLocationIds(): Observable<IdValue[]> {
    var result = this.http
      .get<Pagination<Location>>(
        'https://citytourist.azurewebsites.net/api/v1/locations',
        this.httpOptions
      )
      .pipe(
        map((response: Pagination<Location>) =>
          [...response.data].map(
            (i) =>
              ({
                id: +i.id,
                value: `${i.name}`,
              } as IdValue)
          )
        )
      );
    var data = result.subscribe((data) => {
      console.log(data);
    });
    return result;
  }
  addLocation(
    payload: LocationCreate
  ): Observable<LocationCreateResult> {
    return this.http.post<LocationCreateResult>(
      `https://citytourist.azurewebsites.net/api/v1/locations`,
      payload,
      this.httpOptions
    );
  }

  
}
