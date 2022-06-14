import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'query-string';
import { map, Observable } from 'rxjs';
import {
  Area,
  AreaListItem,
  AreaListSearch,
  Paging,
  IdValue,
  AreaCreate,
  Result,
} from '../models';
import { Pagination } from '../models/pagination.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class AreaService extends BaseService {
  private _sharedHeaders = new HttpHeaders();
  constructor(private http: HttpClient) {
    super();
    this._sharedHeaders = this._sharedHeaders.set(
      'Content-Type',
      'application/json'
    );
  }

  getArea(): Observable<IdValue[]> {
    return this.http
      .get<Pagination<Area>>(
        'https://citytourist.azurewebsites.net/api/v1/areas',
         { headers: this._sharedHeaders }
      )
      .pipe(
        map((response: Pagination<Area>) =>
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

  getAreas(search: AreaListSearch): Observable<Paging<Area>> {
    var sortBy =
      `${search.sort?.sortBy}` === 'undefined' ? '' : search.sort?.sortBy;
    var sortDir =
      `${search?.sort?.dir}` === 'undefined' ? '' : search.sort?.dir;
    const query = stringify({
      name: search.keyword,
      cityid: search?.cityIds,
      pageNumber: isNaN(search?.currentPage!) ? 1 : search?.currentPage! + 1,
      pagesize: 10,
      orderby: `${sortBy} ${sortDir}`,
    });

    var result = this.http.get<Paging<Area>>(
      'https://citytourist.azurewebsites.net/api/v1/areas?' + query,
       { headers: this._sharedHeaders }
    );
    return result;
  }

  getAreaType(): Observable<IdValue[]> {
    return this.http
      .get<Pagination<Area>>(
        'https://citytourist.azurewebsites.net/api/v1/areas',
         { headers: this._sharedHeaders }
      )
      .pipe(
        map((response: Pagination<Area>) =>
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
  addArea(payload: Partial<AreaCreate>): Observable<Result<Partial<Area>>> {
    return this.http.post<Result<Partial<Area>>>(
      `https://citytourist.azurewebsites.net/api/v1/areas/`,
      payload,
       { headers: this._sharedHeaders }
    );
  }
  deleteAreaById(id: string): Observable<string | undefined> {
    return this.http
      .delete(
        `https://citytourist.azurewebsites.net/api/v1/areas/${id}`,
         { headers: this._sharedHeaders }
      )
      .pipe(map((response: Result<AreaListItem>) => response.status));
  }

  getAreaById(id: string | undefined): Observable<Area> {
    return this.http
      .get<Result<Area>>(
        `https://citytourist.azurewebsites.net/api/v1/areas/${id}`,
         { headers: this._sharedHeaders }
      )
      .pipe(
        map(
          (response: Result<Area>) =>
            ({
              id: response.data?.id,
              name: response.data?.name,
              status: response.data?.status,
              cityId: response.data?.cityId,
            } as Area)
        )
      );
  }
  updateAreaById(
    payload: Partial<AreaCreate>
  ): Observable<Result<Partial<Area>>> {
    return this.http.put<Result<Partial<Area>>>(
      `https://citytourist.azurewebsites.net/api/v1/areas/`,
      payload,
       { headers: this._sharedHeaders }
    );
  }
}
