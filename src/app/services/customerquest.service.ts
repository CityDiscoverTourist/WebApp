import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'query-string';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import {
  CustomerQuest,
  CustomerQuestListItem,
  CustomerQuestListSearch,
  Paging,
  Result,
} from '../models';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerquestService extends BaseService {
  private _sharedHeaders = new HttpHeaders();
  constructor(private http: HttpClient) {
    super();
    this._sharedHeaders = this._sharedHeaders.set(
      'Content-Type',
      'application/json'
    );
  }

  getCustomerQuest(
    search: CustomerQuestListSearch
  ): Observable<Paging<CustomerQuestListItem>> {
    var sortBy =
      `${search.sort?.sortBy}` === 'undefined' ? '' : search.sort?.sortBy;
    var sortDir =
      `${search?.sort?.dir}` === 'undefined' ? '' : search.sort?.dir;
    const query = stringify({
      customerEmail: search.keyword,
      pageNumber: isNaN(search?.currentPage!) ? 1 : search?.currentPage! + 1,
      pagesize: 10,
      orderby: `${sortBy} ${sortDir}`,
      isFinished: search?.isFinished,
    });
    return this.http.get<Paging<CustomerQuestListItem>>(
      `${environment.apiUrl}/api/v1/customer-quests?` + query,
      { headers: this._sharedHeaders }
    );
  }

  getCustomerQuestById(id: string | undefined): Observable<CustomerQuest> {
    return this.http
      .get<Result<CustomerQuest>>(`${environment.apiUrl}/api/v1/customer-quests/${id}`, {
        headers: this._sharedHeaders,
      })
      .pipe(map((response: Result<CustomerQuest>) => response.data));
  }
}
