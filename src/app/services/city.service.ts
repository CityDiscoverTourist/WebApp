import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'query-string';
import { map, Observable } from 'rxjs';
import {
  City,
  CityCreate,
  CityCreateResult,
  CityListItem,
  Paging,
  QuestItemCreateResult,
  Result,
  SearchInfo,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  constructor(private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
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
}
