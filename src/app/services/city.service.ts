import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { pagination, Pagination } from '../models';
import { City } from '../models/city.model';
import { BaseService } from './base.service ';

@Injectable({
  providedIn: 'root',
})
export class CityService extends BaseService {
  private _sharedHeaders = new HttpHeaders();
  constructor(private http: HttpClient) {
    super();
    // this._sharedHeaders = this._sharedHeaders.set(
    //   'Content-Type',
    //   'application/json'
    // );
  }
  add(entity: City) {
    entity.status="true";
    entity.id="0";
    var k=JSON.stringify(entity);
    console.log("data nè "+k);
    var kkk={id:0,name:"jjj",status:"kkkdjdh"};
    var ddhhshau=JSON.stringify(kkk);
    var dhsahj=JSON.stringify(entity);
    var input={id:0,name:entity.name,status:entity.status};
    var inputStringify=JSON.stringify(input);
    var hsahjash=9989;
    return this.http
      // .post(`${environment.apiUrl}/citys`, JSON.stringify(kkk), {
      .post(`https://localhost:7235/api/v1/citys`, JSON.stringify(input), 
        this.httpOptions
      )
      // .pipe(catchError(this.handleError));
  }

  update(id: string, entity: City) {
    var kkk={id:0,name:"jjj",status:"kkkdjdh"};

    return this.http
      .put(`https://localhost:7235/api/v1/citys/`, JSON.stringify(entity),this.httpOptions)
      // .pipe(catchError(this.handleError));
  }

  getDetail(id: string) {
    return this.http
      .get<Pagination<City>>(`https://localhost:7235/api/v1/citys/${id}`, this.httpOptions);
      // .pipe(catchError(this.handleError));
  }
//   getDetail(id:number) {
//     return this.http.get<City>(`${environment.apiUrl}/api/cities/${id}`, { headers: this._sharedHeaders })
//         .pipe(catchError(this.handleError));
// }
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  getAllPaging(
    nameFiler: string,
    pageNumber: number,
    pageSize: number,
    orderBy: string
  ) {
    return this.http
      .get<Pagination<City>>(
        `https://localhost:7235/api/v1/citys?Name=${nameFiler}&PageNumber=${pageNumber}&PageSize=${pageSize}&OrderBy=${orderBy}`,
        this.httpOptions
      )
  }

  delete(id: string) {
    return this.http
      .delete('https://localhost:7235/api/v1/citys/' + id, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  // private _sharedHeaders = new HttpHeaders();
  // constructor(private http: HttpClient) {
  //     super();
  //     this._sharedHeaders = this._sharedHeaders.set('Content-Type', 'application/json');
  // }
  // add(entity: City) {
  //     return this.http.post(`${environment.apiUrl}/api/cities`, JSON.stringify(entity), { headers: this._sharedHeaders })
  //         .pipe(catchError(this.handleError));
  // }

  // update(id: string, entity: City) {
  //     return this.http.put(`${environment.apiUrl}/api/cities/${id}`, JSON.stringify(entity), { headers: this._sharedHeaders })
  //         .pipe(catchError(this.handleError));
  // }

  

  // getAllPaging(filter:string, pageIndex:number, pageSize:number) {
  //     return this.http.get<Pagination<City>>(`${environment.apiUrl}/api/roles/filter?pageIndex=${pageIndex}&pageSize=${pageSize}&filter=${filter}`, { headers: this._sharedHeaders })
  //         .pipe(map((response: Pagination<City>) => {
  //             return response;
  //         }), catchError(this.handleError));
  // }

  // delete(id:number) {
  //     return this.http.delete(environment.apiUrl + '/api/roles/' + id, { headers: this._sharedHeaders })
  //         .pipe(
  //             catchError(this.handleError)
  //         );
  // }
}
