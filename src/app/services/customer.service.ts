import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'query-string';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Customer, CustomerListSearch, Paging, Result } from '../models';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerService extends BaseService {
  private _sharedHeaders = new HttpHeaders();
  constructor(private http: HttpClient) {
    super();
    this._sharedHeaders = this._sharedHeaders.set(
      'Content-Type',
      'application/json'
    );
  }

  getCustomers(search: CustomerListSearch): Observable<Paging<Customer>> {
    var sortBy =
      `${search.sort?.sortBy}` === 'undefined' ? '' : search.sort?.sortBy;
    var sortDir =
      `${search?.sort?.dir}` === 'undefined' ? '' : search.sort?.dir;
    var isLock = search?.isLock == null ? undefined : search?.isLock;

    const query = stringify({
      email: search.keyword,
      isLock: isLock,
      pageNumber: isNaN(search?.currentPage!) ? 1 : search?.currentPage! + 1,
      pagesize: 10,
      orderby: `${sortBy} ${sortDir}`,
    });

    return this.http.get<Paging<Customer>>(
      `${environment.apiUrl}/api/v1/customers?` + query,
      { headers: this._sharedHeaders }
    );
  }

  isBlockCustomer(
    id: string,
    isBlock: boolean
  ): Observable<Customer | undefined> {
    console.log(isBlock);

    return this.http
      .put<Result<Customer>>(
        `${environment.apiUrl}/api/v1/customers/${id}/${isBlock}`,
        { headers: this._sharedHeaders }
      )
      .pipe(map((response: Result<Customer>) => response.data));
  }

  getCustomerById(id: string | undefined): Observable<Customer> {
    return this.http
      .get<Result<Customer>>(`${environment.apiUrl}/api/v1/customers/${id}`, {
        headers: this._sharedHeaders,
      })
      .pipe(map((response: Result<Customer>) => response.data));
  }
}
