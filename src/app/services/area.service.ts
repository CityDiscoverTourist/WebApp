import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'query-string';
import { map, Observable, of } from 'rxjs';
import {
  Area,
  AreaListItem,
  AreaListSearch,
  LocationListItem,
  LocationListSearch,
  Paging,
  AreaData,
  IdValue,
} from '../models';
import { Pagination } from '../models/pagination.model';

@Injectable({
  providedIn: 'root',
})
export class AreaService {
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
  };

  // getAreas(search: AreaListSearch) {
  // getAreas(search:AreaListSearch) :Observable<Pagination<Area>>{
  //   // return of([]);

  //   // console.log(search);

  //   // return of({
  //   //   records: [...Array(200).keys()].map(
  //   //     (i) =>
  //   //       ({
  //   //         id: i,
  //   //         name: `${i} name`,
  //   //         status: `${i} status`,
  //   //         cityId: i
  //   //       } as AreaListItem)
  //   //   ),
  //   //   metadata: {
  //   //     currentPage: 0,
  //   //     itemPerPage: 10,
  //   //     count: 200,
  //   //   },
  //   // } as Paging<AreaListItem>);

  //   var result = this.http
  //     .get<Pagination<Area>>(
  //       'https://citytourist.azurewebsites.net/api/v1/areas',
  //       this.httpOptions
  //     )
  //     .pipe(
  //       map(
  //         (response: Pagination<Area>) =>
  //           // Object.values(response)
  //           response as Pagination<Area>
  //       )
  //     );
  //   return result;
  // }

//   getAreas(search:AreaListSearch) :Observable<Pagination<Area>>{
//   console.log('test '+search?.currentPage);
  
//   var sortBy= `${search.sort?.sortBy}` ==='undefined'?'':search.sort?.sortBy;
//   var sortDir= `${search?.sort?.dir}` ==='undefined'?'':search.sort?.dir;
//     const query=stringify({
//       name:search.keyword,
//       cityid:search?.cityIds,
//       pageNume:search.currentPage,
//       pagesize:10,
//       orderby:`${sortBy} ${sortDir}`,
//     })

//     console.log("ddddddddd");
    
//     console.log(query);
    

//     var result = this.http
//       .get<Pagination<Area>>(
//         'https://citytourist.azurewebsites.net/api/v1/areas?'+query,
//         this.httpOptions
//       )
//       .pipe(
//         map(
//           (response: Pagination<Area>) =>
//             // Object.values(response)
//             response as Pagination<Area>
//         )
//       );
//     return result;
//   }

  getAreas(search:AreaListSearch) :Observable<Paging<Area>>{
  console.log('test '+search?.currentPage);
  
  var sortBy= `${search.sort?.sortBy}` ==='undefined'?'':search.sort?.sortBy;
  var sortDir= `${search?.sort?.dir}` ==='undefined'?'':search.sort?.dir;
    const query=stringify({
      name:search.keyword,
      cityid:search?.cityIds,
      pageNumber:isNaN(search?.currentPage!)? 1: (search?.currentPage!+1),
      pagesize:10,
      orderby:`${sortBy} ${sortDir}`,
    })
    console.log("ddddddddd");
    console.log(query);
      var result = this.http
      .get<Paging<Area>>(
        'https://citytourist.azurewebsites.net/api/v1/areas?'+query,
        this.httpOptions
      )
      // .pipe(
        // map(
        //   (response: PagingTest<Area>) =>
        //     // Object.values(response)
        //     response as PagingTest<Area>
        // )
        // map(
        //   (response: PagingTest<Area>) =>{
        //     var data={
        //       data:response.data,
        //       message:response.message,
        //       pagination:{
        //         ...response.pagination,
        //         currentPage:response.pagination.currentPage>0 ?response.pagination.currentPage-1:response.pagination.currentPage
        //       },
        //       status:response.status,
        //     }
        //     console.log("dataxxxxxxxxxxxx ",data);
            
        //     return data;
        //   }
          
        //   )
      // );
    return result;
  }
  addArea(area:AreaData):Observable<any>{
    var areaCreate={
      "id": 0,
      "name": area.name,
      "status": area.status,
      "cityId": 2
    }
    return this.http.post<any>(`https://citytourist.azurewebsites.net/api/v1/areas/`,areaCreate);
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
}
