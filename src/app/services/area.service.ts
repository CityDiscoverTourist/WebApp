import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  AreaListItem,
  AreaListSearch,
  LocationListItem,
  LocationListSearch,
  Paging,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class AreaService {
  constructor() {}

  getAreas(search: AreaListSearch): Observable<Paging<AreaListItem>> {
    // return of([]);

    console.log(search);

    // return of({} as Paging<Location>);
    return of({
      records: [...Array(200).keys()].map(
        (i) =>
          ({
            id: i,
            name: `${i} name`,
            status: `${i} status`,
            cityId: i
          } as AreaListItem)
      ),
      metadata: {
        currentPage: 0,
        itemPerPage: 10,
        count: 200,
      },
    } as Paging<AreaListItem>);
  }
}
