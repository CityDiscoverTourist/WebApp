import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'query-string';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import {
  City,
  CityCreate,
  CityListItem,
  CityListSearch,
  IdValue,
  Paging,
  Result
} from '../models';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class CityService extends BaseService {
  private _sharedHeaders = new HttpHeaders();
  constructor(private http: HttpClient) {
    super();
    this._sharedHeaders = this._sharedHeaders.set(
      'Content-Type',
      'application/json'
    );
  }
  getCityIdValue(): Observable<IdValue[]> {
    return this.http
      .get<Paging<City>>(`${environment.apiUrl}/api/v1/cites`, {
        headers: this._sharedHeaders,
      })
      .pipe(
        map((response: Paging<City>) =>
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
  getCities(search: CityListSearch): Observable<Paging<CityListItem>> {
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
    var result = this.http.get<Paging<CityListItem>>(
      `${environment.apiUrl}/api/v1/cites?` + query,
      { headers: this._sharedHeaders }
    );
    return result;
  }

  addCity(cityCreate: Partial<CityCreate>): Observable<Result<Partial<City>>> {
    return this.http.post<Result<Partial<City>>>(
      `${environment.apiUrl}/api/v1/cites/`,
      cityCreate,
      { headers: this._sharedHeaders }
    );
  }

  deleteCityById(id: string): Observable<CityListItem | undefined> {
    return this.http
      .delete<Result<CityListItem>>(
        `${environment.apiUrl}/api/v1/cites/${id}`,
        {
          headers: this._sharedHeaders,
        }
      )
      .pipe(map((response: Result<CityListItem>) => response.data));
  }
  getCityById(id: string | undefined): Observable<City> {
    return this.http
      .get<Result<City>>(`${environment.apiUrl}/api/v1/cites/${id}`, {
        headers: this._sharedHeaders,
      })
      .pipe(
        map(
          (response: Result<City>) =>
            ({
              id: response.data?.id,
              name: response.data?.name,
              status: response.data?.status,
            } as City)
        )
      );
  }

  updateCity(payload: Partial<CityCreate>): Observable<Result<Partial<City>>> {
    return this.http.put<Result<Partial<City>>>(
      `${environment.apiUrl}/api/v1/cites/`,
      payload,
      { headers: this._sharedHeaders }
    );
  }

  checkNameExisted(name: string): Observable<boolean> {
    const query = stringify({
      name,
    });
    return this.http.get<boolean>(
      `${environment.apiUrl}/api/v1/cites/check?` + query,
      { headers: this._sharedHeaders }
    );
  }
}
