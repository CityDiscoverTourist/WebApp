import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'query-string';
import { map, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  IdValue, Location, LocationCreate, LocationListItem,
  LocationListSearch,
  Paging,
  Result
} from '../models';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class LocationService extends BaseService {
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
      .get<Paging<Location>>(`${environment.apiUrl}/api/v1/locations`, {
        headers: this._sharedHeaders,
      })
      .pipe(
        map((response: Paging<Location>) =>
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
      `${environment.apiUrl}/api/v1/locations?` + query,
      { headers: this._sharedHeaders }
    );
    return result;
  }

  addLocation(
    payload: Partial<LocationCreate>
  ): Observable<Result<Partial<Location>>> {
    return this.http.post<Result<Partial<Location>>>(
      `${environment.apiUrl}/api/v1/locations/`,
      payload,
      { headers: this._sharedHeaders }
    );
  }

  deleteLocationById(id: string): Observable<LocationListItem | undefined> {
    return this.http
      .delete<Result<LocationListItem>>(
        `${environment.apiUrl}/api/v1/locations/${id}`,
        { headers: this._sharedHeaders }
      ).pipe(map((response: Result<LocationListItem>) => response.data));
  }

  getLocationById(id: string | undefined): Observable<Location> {
    return this.http
      .get<Result<Location>>(`${environment.apiUrl}/api/v1/locations/${id}`, {
        headers: this._sharedHeaders,
      })
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
  ): Observable<Result<Partial<Location>>> {
    return this.http.put<Result<Partial<Location>>>(
      `${environment.apiUrl}/api/v1/locations/`,
      payload,
      { headers: this._sharedHeaders }
    );
  }

  checkNameExisted(name: string): Observable<boolean> {
    const query = stringify({
      name,
    });
    return this.http.get<boolean>(
      `${environment.apiUrl}/api/v1/locations/check?` + query,
      { headers: this._sharedHeaders }
    );
  }

  locationAdded$ = new Subject<{ id: number; name: string }>();
}
