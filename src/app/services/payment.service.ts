import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'query-string';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Paging, Payment, PaymentListSearch } from '../models';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService extends BaseService {
  private _sharedHeaders = new HttpHeaders();
  constructor(private http: HttpClient) {
    super();
    this._sharedHeaders = this._sharedHeaders.set(
      'Content-Type',
      'application/json'
    );
  }

  getPayments(search: PaymentListSearch): Observable<Paging<Payment>> {
    var sortBy =
      `${search.sort?.sortBy}` === 'undefined' ? '' : search.sort?.sortBy;
    var sortDir =
      `${search?.sort?.dir}` === 'undefined' ? '' : search.sort?.dir;
    var status = search?.status == null ? undefined : search?.status;
    
    const query = stringify({
      status: status,
      pageNumber: isNaN(search?.currentPage!) ? 1 : search?.currentPage! + 1,
      pagesize: 10,
      orderby: `${sortBy} ${sortDir}`,
    });

    return this.http.get<Paging<Payment>>(
      `${environment.apiUrl}/api/v1/payments?` + query,
      { headers: this._sharedHeaders }
    );
  }
}
