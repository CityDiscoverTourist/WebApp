import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'query-string';
import { map, Observable } from 'rxjs';
import {
  City,
  CityCreate,
  CityCreateResult,
  CityListItem,
  IdValue,
  Paging,
  Result,
  SearchInfo,
} from '../models';
import { Pagination } from '../models/pagination.model';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  constructor(private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getCityIdValue(): Observable<IdValue[]> {
    return this.http
      .get<Pagination<City>>(
        'https://citytourist.azurewebsites.net/api/v1/cites',
        this.httpOptions
      )
      .pipe(
        map((response: Pagination<City>) =>
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
  getCities(search: SearchInfo): Observable<Paging<CityListItem>> {
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
    var result = this.http.get<Paging<CityListItem>>(
      'https://citytourist.azurewebsites.net/api/v1/cites?' + query,
      this.httpOptions
    );
    return result;
  }

  addCity(cityCreate: Partial<CityCreate>): Observable<Result<Partial<City>>> {
    return this.http.post<Result<Partial<City>>>(
      `https://citytourist.azurewebsites.net/api/v1/cites/`,
      cityCreate,
      this.httpOptions
    );
  }

  deleteCityById(id: string): Observable<string | undefined> {
    return this.http
      .delete(
        `https://citytourist.azurewebsites.net/api/v1/cites/${id}`,
        this.httpOptions
      )
      .pipe(map((response: Result<CityListItem>) => response.status));
  }
  getCityById(id: string | undefined): Observable<City> {
    return this.http
      .get<Result<City>>(
        `https://citytourist.azurewebsites.net/api/v1/cites/${id}`,
        this.httpOptions
      )
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

  updateCity(payload: CityCreate): Observable<CityCreateResult> {
    return this.http
      .put<Result<City>>(
        `https://citytourist.azurewebsites.net/api/v1/cites/`,
        payload,
        this.httpOptions
      )
      .pipe(
        map(
          (response: Result<City>) =>
            ({ id: response.data?.id } as CityCreateResult)
        )
      );
  }
}
