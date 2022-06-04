import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import {
  IdValue,
  LocationListItem,
  LocationListSearch,
  Paging,
  SearchInfo,
} from '../models';
import { Pagination } from '../models/pagination.model';
import { Location } from '../models';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({ encrypt: 'multipart/form-data' }),
  };
  // getLocations(search:LocationListSearch):Observable<Location[]>{
  //   // return of([]);
  //   console.log('Text');

  //   console.log(search);

  //   return of([]);
  // }

  //bo sung them paging commom
  getLocations(
    search: LocationListSearch
  ): Observable<Paging<LocationListItem>> {
    // return of([]);

    console.log(search);

    // return of({} as Paging<Location>);
    //  return of({
    //    records:[...Array(200).keys()].map(
    //     (i) =>
    //       ({
    //         id: `${i} id`,
    //         name: `${i} name`,
    //         description: `${i} description`,
    //         longitude: `${i} longitude `,
    //         latitude: `${i} latitude`,
    //         address: `${i} address`,
    //         status: `${i} status`,
    //         areaId: i * 2,
    //         locationTypeId: i * 3,
    //       } as LocationListItem),
    //       ),
    //       metadata:{
    //         currentPage:0,
    //         itemPerPage:25,
    //         count:200
    //       }

    //   } as Paging<LocationListItem>);
    return of();
  }

  getLocationIds(): Observable<IdValue[]> {
    var result= this.http
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
      var data=result.subscribe((data)=>{
        console.log(data);
      })
      return result;
  }
}
