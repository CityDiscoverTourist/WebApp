import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'query-string';
import { Observable } from 'rxjs';
import { CustomerTask, CustomerTaskListSearch, Paging } from '../models';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class CustomertaskService extends BaseService {
  private _sharedHeaders = new HttpHeaders();
  constructor(private http: HttpClient) {
    super();
    this._sharedHeaders = this._sharedHeaders.set(
      'Content-Type',
      'application/json'
    );
  }

  getAreas(search: CustomerTaskListSearch): Observable<Paging<CustomerTask>> {
    var sortBy =
      `${search.sort?.sortBy}` === 'undefined' ? '' : search.sort?.sortBy;
    var sortDir =
      `${search?.sort?.dir}` === 'undefined' ? '' : search.sort?.dir;
    const query = stringify({
      name: search.keyword,
      status: search.status,
      pageNumber: isNaN(search?.currentPage!) ? 1 : search?.currentPage! + 1,
      pagesize: 10,
      orderby: `${sortBy} ${sortDir}`,
    });

    var result = this.http.get<Paging<CustomerTask>>(
      'https://citytourist.azurewebsites.net/api/v1/customer-tasks?' + query,
      { headers: this._sharedHeaders }
    );
    return result;
  }
}
