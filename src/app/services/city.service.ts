import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { id } from '@swimlane/ngx-datatable';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IdValue, pagination, Pagination } from '../models';
import { City, CityForTest } from '../models/city.model';
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
    entity.status = 'true';
    entity.id = '0';
    var k = JSON.stringify(entity);
    console.log('data nè ' + k);
    var kkk = { id: 0, name: 'jjj', status: 'kkkdjdh' };
    var ddhhshau = JSON.stringify(kkk);
    var dhsahj = JSON.stringify(entity);
    var input = { id: 0, name: entity.name, status: entity.status };
    var inputStringify = JSON.stringify(input);
    var hsahjash = 9989;
    return (
      this.http
        // .post(`${environment.apiUrl}/citys`, JSON.stringify(kkk), {
        .post(
          `https://localhost:7235/api/v1/citys`,
          JSON.stringify(input),
          this.httpOptions
        )
    );
    // .pipe(catchError(this.handleError));
  }

  update(id: string, entity: City) {
    var kkk = { id: 0, name: 'jjj', status: 'kkkdjdh' };

    return this.http.put(
      `https://localhost:7235/api/v1/citys/`,
      JSON.stringify(entity),
      this.httpOptions
    );
    // .pipe(catchError(this.handleError));
  }

  getDetail(id: string) {
    return this.http.get<Pagination<City>>(
      `https://localhost:7235/api/v1/citys/${id}`,
      this.httpOptions
    );
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
    return this.http.get<Pagination<City>>(
      `https://localhost:7235/api/v1/citys?Name=${nameFiler}&PageNumber=${pageNumber}&PageSize=${pageSize}&OrderBy=${orderBy}`,
      this.httpOptions
    );
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

  // getCityType():Observable<IdValue[]>{
  //   return of([...Array(6).keys()].map(
  //     (i) =>
  //       ({
  //         id: i,
  //         value: `${i} id`
  //       })));
  // }

  // getAll(){
  //   return this.http.get("https://citytourist.azurewebsites.net/api/v1/citys",this.httpOptions).pipe(map((res: any) => Object.values(res)))
  //   ngOnInit(): void {
  //  var result = this.s.getAll();
  //  console.log('data ' + result?.forEach((x) => console.log('x x' + x)));
  //  console.log('data ' + result);

  //  var b = 1;

  getCityType(): Observable<IdValue[]> {
    // return of([...Array(6).keys()].map(
    //   (i) =>
    //     ({
    //       id: i,
    //       value: `${i} id`
    //     })));
    const data: IdValue[] = [];
    // var result =
    var result= this.http
      .get<Pagination<CityForTest>>(
        'https://citytourist.azurewebsites.net/api/v1/citys',
        this.httpOptions
      )
      .pipe(
        map((response: Pagination<CityForTest>) =>
          // res.data.forEach(x=>console.log("dddd", x.id + x.name +x.status))
          //return of()
          [...response.data].map(
            (i) =>
              ({
                id: i.id,
                value: `${i.name}`,
              } as IdValue)
          )
        )
      );

    console.log(result);
    var a=0;
    
    return result;
      
    // return of(
    //   [...Array(6).keys()].map((i) => ({
    //     id: i,
    //     value: `${i} id`,
    //   }))
    // );
    // return result;
  }
}
