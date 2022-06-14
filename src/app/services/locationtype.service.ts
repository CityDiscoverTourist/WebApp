import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'query-string';
import { map, Observable, of } from 'rxjs';
import {
  IdValue,
  LocationType,
  LocationTypeCreate,
  LocationTypeListItem,
  LocationTypeListSearch,
  Paging,
  Result,
} from '../models';
import { Pagination } from '../models/pagination.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class LocationtypeService extends BaseService {
  private _sharedHeaders = new HttpHeaders();
  constructor(private http: HttpClient) {
    super();
    this._sharedHeaders = this._sharedHeaders.set(
      'Content-Type',
      'application/json'
    );
  }

  getLocationTypes(
    search: LocationTypeListSearch
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
      status: search?.status,
    });
    var result = this.http.get<Paging<LocationTypeListItem>>(
      'https://citytourist.azurewebsites.net/api/v1/location-types?' + query,
      { headers: this._sharedHeaders }
    );
    return result;
  }

  addLocationType(
    payload: Partial<LocationTypeCreate>
  ): Observable<Result<Partial<LocationType>>> {
    return this.http.post<Result<Partial<LocationType>>>(
      `https://citytourist.azurewebsites.net/api/v1/location-types/`,
      payload,
      { headers: this._sharedHeaders }
    );
  }
  deleteLocationTypeById(id: string): Observable<string | undefined> {
    return this.http
      .delete(
        `https://citytourist.azurewebsites.net/api/v1/location-types/${id}`,
        { headers: this._sharedHeaders }
      )
      .pipe(map((response: Result<LocationTypeListItem>) => response.status));
  }

  getLocationTypeById(id: string | undefined): Observable<LocationType> {
    return this.http
      .get<Result<LocationType>>(
        `https://citytourist.azurewebsites.net/api/v1/location-types/${id}`,
        { headers: this._sharedHeaders }
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
      { headers: this._sharedHeaders }
    );
  }

  getLocationType(): Observable<IdValue[]> {
    return this.http
      .get<Pagination<LocationType>>(
        'https://citytourist.azurewebsites.net/api/v1/location-types',
        { headers: this._sharedHeaders }
      )
      .pipe(
        map((response: Pagination<LocationType>) =>
          [...response.data].map(
            (i) =>
              ({
                id: i.id,
                value: `${i.name}`,
              } as IdValue)
          )
        )
      );
  }
}
