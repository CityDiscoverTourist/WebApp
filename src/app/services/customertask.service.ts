import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'query-string';
import { Observable } from 'rxjs';
import { CustomerTask, CustomerTaskListItem, CustomerTaskListSearch, Paging } from '../models';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class CustomertaskService extends BaseService {
  private _sharedHeaders = new HttpHeaders();
  constructor(  private httpClient: HttpClient,) {
    super();
    this._sharedHeaders = this._sharedHeaders.set(
      'Content-Type',
      'application/json'
    );
  }

   startHttpRequest(
    id: string
  ): Observable<Paging<CustomerTaskListItem>> {
    return this.httpClient.get<Paging<CustomerTaskListItem>>(
      `https://citytourist.azurewebsites.net/api/v1/customer-tasks/get-by-customer-quest-id/${id}?PageSize=100`
    );
  }

}
