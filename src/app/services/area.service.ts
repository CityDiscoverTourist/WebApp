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

@Injectable({
  providedIn: 'root',
})
export class AreaService {
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

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
      this.httpOptions
    );
    return result;
  }

  getAreaType(): Observable<IdValue[]> {
    return this.http
      .get<Pagination<Area>>(
        'https://citytourist.azurewebsites.net/api/v1/areas',
        this.httpOptions
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
      this.httpOptions
    );
  }
  deleteAreaById(id: string): Observable<string | undefined> {
    return this.http
      .delete(
        `https://citytourist.azurewebsites.net/api/v1/areas/${id}`,
        this.httpOptions
      )
      .pipe(map((response: Result<AreaListItem>) => response.status));
  }

  getAreaById(id: string | undefined): Observable<Area> {
    return this.http
      .get<Result<Area>>(
        `https://citytourist.azurewebsites.net/api/v1/areas/${id}`,
        this.httpOptions
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
      this.httpOptions
    );
  }
}
