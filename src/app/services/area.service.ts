import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LocationListItem, LocationListSearch, Paging } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  constructor() { }

  getAreas(search:LocationListSearch):Observable<Paging<LocationListItem>>{
    // return of([]);
    
    console.log(search);
    
    // return of({} as Paging<Location>);
     return of({
       records:[...Array(200).keys()].map(
        (i) =>
          ({
            id: `${i} id`,
            name: `${i} name`,
            description: `${i} description`,
            longitude: `${i} longitude `,
            latitude: `${i} latitude`,
            address: `${i} address`,
            status: `${i} status`,
            areaId: i * 2,
            locationTypeId: i * 3,
          } as LocationListItem),
          ),
          metadata:{
            currentPage:0,
            itemPerPage:25,
            count:200
          }

      } as Paging<LocationListItem>);
  }
}
