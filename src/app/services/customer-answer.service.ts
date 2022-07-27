import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CustomerAnswer, Paging, Result } from '../models';
import { BaseService } from './base.service';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class CustomerAnswerService extends BaseService {
  private _sharedHeaders = new HttpHeaders();
  constructor(private http: HttpClient) {
    super();
    this._sharedHeaders = this._sharedHeaders.set(
      'Content-Type',
      'application/json'
    );
  }

  getCustomerAnwerByCustomerTask(id: string): Observable<CustomerAnswer[]> {
   return this.http.get<Paging<CustomerAnswer>>(
      `${environment.apiUrl}/api/v1/customer-answers/get-by-customer-task-id/${id}`,
      { headers: this._sharedHeaders }
    ) .pipe(map((response: Paging<CustomerAnswer>) => response.data));;
    
  }
}
