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
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class LocationService   extends BaseService {
  private _sharedHeaders = new HttpHeaders();
  constructor(private http: HttpClient) {
    super();
    this._sharedHeaders = this._sharedHeaders.set(
      'Content-Type',
      'application/json'
    );
  }
 

  getLocationIds(): Observable<IdValue[]> {
    var result = this.http
      .get<Pagination<Location>>(
        'https://citytourist.azurewebsites.net/api/v1/locations',
        { headers: this._sharedHeaders }
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
      { headers: this._sharedHeaders }
    );
    return result;
  }

  // addLocation(payload: LocationCreate): 
  // Observable<LocationCreateResult> {
  //   return this.http.post<LocationCreateResult>(
  //     `https://citytourist.azurewebsites.net/api/v1/locations`,
  //     payload,
  //     { headers: this._sharedHeaders }
  //   );
  // }

  addLocation(
    payload: Partial<LocationCreate>
  ): Observable<Result<Partial<Location>>> {
    return this.http.post<Result<Partial<Location>>>(
      `https://citytourist.azurewebsites.net/api/v1/location/`,
      payload,
      { headers: this._sharedHeaders }
    );
  }

  deleteLocationById(id: string): Observable<string | undefined> {
    return this.http
      .delete(
        `https://citytourist.azurewebsites.net/api/v1/locations/${id}`,
        { headers: this._sharedHeaders }
      )
      .pipe(map((response: Result<LocationListItem>) => response.status));
  }

  getLocationById(id: string | undefined): Observable<Location> {
    return this.http
      .get<Result<Location>>(
        `https://citytourist.azurewebsites.net/api/v1/locations/${id}`,
        { headers: this._sharedHeaders }
      )
      .pipe(
        map(
          (response: Result<Location>) =>
            ({
              id: response.data?.id,
              name: response.data?.name,
              description: response.data?.description,
              longitude: response.data?.longitude,
              latitude: response.data?.latitude,
              address: response.data?.address,
              status: response.data?.status,
              areaId: response.data?.areaId,
              locationTypeId: response.data?.locationTypeId,
            } as Location)
        )
      );
  }
  updateLocationById(
    payload: Partial<LocationCreate>
  ): Observable<LocationCreateResult> {
    return this.http
      .put<Result<Location>>(
        `https://citytourist.azurewebsites.net/api/v1/locations/`,
        payload,
        { headers: this._sharedHeaders }
      )
      .pipe(
        map(
          (response: Result<Location>) =>
            ({ id: response.data?.id } as LocationCreateResult)
        )
      );
  }
}
