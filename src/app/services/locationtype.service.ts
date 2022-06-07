import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'query-string';
import { map, Observable, of } from 'rxjs';
import {
  IdValue,
  LocationType,
  LocationTypeCreate,
  LocationTypeListItem,
  Paging,
  Result,
  SearchInfo,
} from '../models';
import { Pagination } from '../models/pagination.model';

@Injectable({
  providedIn: 'root',
})
export class LocationtypeService {
  constructor(private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  getLocationTypes(
    search: SearchInfo
  ): Observable<Paging<LocationTypeListItem>> {
    var sortBy =
      `${search.sort?.sortBy}` === 'undefined' ? '' : search.sort?.sortBy;
    var sortDir =
      `${search?.sort?.dir}` === 'undefined' ? '' : search.sort?.dir;
    const query = stringify({
      name: search.keyword,
      pageNumber: isNaN(search?.currentPage!) ? 1 : search?.currentPage! + 1,
      pagesize: 10,
      orderby: `${sortBy} ${sortDir}`,
    });
    var result = this.http.get<Paging<LocationTypeListItem>>(
      'https://citytourist.azurewebsites.net/api/v1/location-types?' + query,
      this.httpOptions
    );
    return result;
  }

  addLocationType(
    payload: Partial<LocationTypeCreate>
  ): Observable<Result<Partial<LocationType>>> {
    return this.http.post<Result<Partial<LocationType>>>(
      `https://citytourist.azurewebsites.net/api/v1/location-types/`,
      payload,
      this.httpOptions
    );
  }
  deleteLocationTypeById(id: string): Observable<string | undefined> {
    return this.http
      .delete(
        `https://citytourist.azurewebsites.net/api/v1/location-types/${id}`,
        this.httpOptions
      )
      .pipe(map((response: Result<LocationTypeListItem>) => response.status));
  }

  getLocationTypeById(id: string | undefined): Observable<LocationType> {
    return this.http
      .get<Result<LocationType>>(
        `https://citytourist.azurewebsites.net/api/v1/location-types/${id}`,
        this.httpOptions
      )
      .pipe(
        map(
          (response: Result<LocationType>) =>
            ({
              id: response.data?.id,
              name: response.data?.name,
              status: response.data?.status,
            } as LocationType)
        )
      );
  }
  updateLocationTypeById(
    payload: Partial<LocationTypeCreate>
  ): Observable<Result<Partial<LocationType>>> {
    return this.http.put<Result<Partial<LocationType>>>(
      `https://citytourist.azurewebsites.net/api/v1/location-types/`,
      payload,
      this.httpOptions
    );
  }

  getLocationType(): Observable<IdValue[]> {
    return of(
      [...Array(6).keys()].map((i) => ({
        id: i,
        value: `${i} id`,
      }))
    );
  }
}
