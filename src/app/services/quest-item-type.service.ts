import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'query-string';
import { map, Observable } from 'rxjs';
import {
  IdValue,
  Paging,
  QuestItemType,
  QuestItemTypeCreate,
  QuestItemTypeListItem,
  QuestItemTypeListSearch,
  Result,
} from '../models';
import { Pagination } from '../models/pagination.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class QuestItemTypeService extends BaseService{
  private _sharedHeaders = new HttpHeaders();
  constructor(private http: HttpClient) {
    super();
    this._sharedHeaders = this._sharedHeaders.set(
      'Content-Type',
      'application/json'
    );
  }
  getQuestItemTypeIds(): Observable<IdValue[]> {
    var result = this.http
      .get<Pagination<QuestItemType>>(
        'https://citytourist.azurewebsites.net/api/v1/quest-item-types',
         { headers: this._sharedHeaders }
      )
      .pipe(
        map((response: Pagination<QuestItemType>) =>
          [...response.data].map(
            (i) =>
              ({
                id: i.id,
                value: `${i.name}`,
              } as IdValue)
          )
        )
      );
    return result;
  }

  getQuestItemTypes(
    search: QuestItemTypeListSearch
  ): Observable<Paging<QuestItemTypeListItem>> {
    var sortBy =
      `${search.sort?.sortBy}` === 'undefined' ? '' : search.sort?.sortBy;
    var sortDir =
      `${search?.sort?.dir}` === 'undefined' ? '' : search.sort?.dir;
    const query = stringify({
      name: search.keyword,
      pageNumber: isNaN(search?.currentPage!) ? 1 : search?.currentPage! + 1,
      pagesize: 10,
      orderby: `${sortBy} ${sortDir}`,
      status: search?.status,
    });
    var result = this.http.get<Paging<QuestItemTypeListItem>>(
      'https://citytourist.azurewebsites.net/api/v1/quest-item-types?' + query,
       { headers: this._sharedHeaders }
    );
    return result;
  }

  addQuestItemType(
    payload: Partial<QuestItemTypeCreate>
  ): Observable<Result<Partial<QuestItemType>>> {
    return this.http.post<Result<Partial<QuestItemType>>>(
      `https://citytourist.azurewebsites.net/api/v1/quest-item-types/`,
      payload,
       { headers: this._sharedHeaders }
    );
  }
  deleteQuestItemTypeById(id: string): Observable<string | undefined> {
    return this.http
      .delete<Result<QuestItemTypeListItem>>(
        `https://citytourist.azurewebsites.net/api/v1/quest-item-types/${id}`,
         { headers: this._sharedHeaders }
      )
      .pipe(map((response: Result<QuestItemTypeListItem>) => response.status));
  }

  getQuestItemTypeById(id: string | undefined): Observable<QuestItemType> {
    return this.http
      .get<Result<QuestItemType>>(
        `https://citytourist.azurewebsites.net/api/v1/quest-item-types/${id}`,
         { headers: this._sharedHeaders }
      )
      .pipe(
        map(
          (response: Result<QuestItemType>) =>
            ({
              id: response.data?.id,
              name: response.data?.name,
              status: response.data?.status,
            } as QuestItemType)
        )
      );
  }
  updateQuestItemTypeById(
    payload: Partial<QuestItemTypeCreate>
  ): Observable<Result<Partial<QuestItemType>>> {
    return this.http.put<Result<Partial<QuestItemType>>>(
      `https://citytourist.azurewebsites.net/api/v1/quest-item-types/`,
      payload,
       { headers: this._sharedHeaders }
    );
  }
}
