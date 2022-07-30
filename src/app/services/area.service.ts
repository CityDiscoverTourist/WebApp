import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'query-string';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import {
  Area,
  AreaCreate,
  AreaListItem,
  AreaListSearch,
  IdValue,
  Paging,
  Result,
} from '../models';
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

  getAreaIdValue(): Observable<IdValue[]> {
    return this.http
      .get<Paging<Area>>(`${environment.apiUrl}/api/v1/areas`, {
        headers: this._sharedHeaders,
      })
      .pipe(
        map((response: Paging<Area>) =>
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
    var cityId = search?.cityIds == null ? 0 : search?.cityIds;

    const query = stringify({
      name: search.keyword,
      // cityid: search?.cityIds,
      cityid: cityId,
      pageNumber: isNaN(search?.currentPage!) ? 1 : search?.currentPage! + 1,
      pagesize: 10,
      orderby: `${sortBy} ${sortDir}`,
    });

    var result = this.http.get<Paging<Area>>(
      `${environment.apiUrl}/api/v1/areas?` + query,
      { headers: this._sharedHeaders }
    );
    return result;
  }

  addArea(payload: Partial<AreaCreate>): Observable<Result<Partial<Area>>> {
    return this.http.post<Result<Partial<Area>>>(
      `${environment.apiUrl}/api/v1/areas/`,
      payload,
      { headers: this._sharedHeaders }
    );
  }
  deleteAreaById(id: string): Observable<AreaListItem | undefined> {
    return this.http
      .delete<Result<AreaListItem>>(
        `${environment.apiUrl}/api/v1/areas/${id}`,
        { headers: this._sharedHeaders }
      )
      .pipe(map((response: Result<AreaListItem>) => response.data));
  }

  getAreaById(id: string | undefined): Observable<Area> {
    return this.http
      .get<Result<Area>>(`${environment.apiUrl}/api/v1/areas/${id}/not-language`, {
        headers: this._sharedHeaders,
      })
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
      `${environment.apiUrl}/api/v1/areas/`,
      payload,
      { headers: this._sharedHeaders }
    );
  }

  checkNameExisted(name: string): Observable<boolean> {
    const query = stringify({
      name,
    });
    return this.http.get<boolean>(
      `${environment.apiUrl}/api/v1/areas/check?` + query,
      { headers: this._sharedHeaders }
    );
  }

  updateStatus(
    id: string,
    status: string
  ): Observable<AreaListItem | undefined> {
    return this.http
      .put<Result<AreaListItem>>(
        `${environment.apiUrl}/api/v1/areas/${
          status == 'Active' ? 'enable' : 'disable'
        }/${id}`,
        {
          headers: this._sharedHeaders,
        }
      )
      .pipe(map((response: Result<AreaListItem>) => response.data));
  }
}
