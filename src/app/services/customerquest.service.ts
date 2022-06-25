import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'query-string';
import { Observable } from 'rxjs';
import {
  CustomerQuestListItem,
  CustomerQuestListSearch,
  Paging,
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

  getQuestTypes(
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
      'https://citytourist.azurewebsites.net/api/v1/customer-quests?' + query,
      { headers: this._sharedHeaders }
    );
  }
}
