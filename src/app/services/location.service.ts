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
import { stringify } from 'query-string';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
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
    return result;
  }

  getLocations(
    search: LocationListSearch
  ): Observable<Paging<LocationListItem>> {
    var sortBy =
      `${search.sort?.sortBy}` === 'undefined' ? '' : search.sort?.sortBy;
    var sortDir =
      `${search?.sort?.dir}` === 'undefined' ? '' : search.sort?.dir;
    const query = stringify({
      name: search.keyword,
      areaId: search.areaIds == undefined ? 0 : search.areaIds,
      locationTypeId:
        search.locationTypeIds == undefined ? 0 : search.locationTypeIds,
      pageNumber: isNaN(search?.currentPage!) ? 1 : search?.currentPage! + 1,
      pagesize: 10,
      orderby: `${sortBy} ${sortDir}`,
    });
    var result = this.http.get<Paging<LocationListItem>>(
      `https://citytourist.azurewebsites.net/api/v1/locations?` + query,
      this.httpOptions
    );
    return result;
  }

  addLocation(payload: LocationCreate): Observable<LocationCreateResult> {
    return this.http.post<LocationCreateResult>(
      `https://citytourist.azurewebsites.net/api/v1/locations`,
      payload,
      this.httpOptions
    );
  }
  deleteLocationById(id: string): Observable<string | undefined> {
    return this.http
      .delete(
        `https://citytourist.azurewebsites.net/api/v1/locations/${id}`,
        this.httpOptions
      )
      .pipe(map((response: Result<LocationListItem>) => response.status));
  }
}
