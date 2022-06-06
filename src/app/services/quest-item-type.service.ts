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
  Result,
  SearchInfo,
} from '../models';
import { Pagination } from '../models/pagination.model';

@Injectable({
  providedIn: 'root',
})
export class QuestItemTypeService {
  constructor(private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  getQuestItemTypeIds(): Observable<IdValue[]> {
    var result = this.http
      .get<Pagination<QuestItemType>>(
        'https://citytourist.azurewebsites.net/api/v1/quest-item-types',
        this.httpOptions
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
    search: SearchInfo
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
    });
    var result = this.http.get<Paging<QuestItemTypeListItem>>(
      'https://citytourist.azurewebsites.net/api/v1/quest-item-types?' + query,
      this.httpOptions
    );
    return result;
  }

  addQuestItemType(
    questItemTypeCreate: Partial<QuestItemTypeCreate>
  ): Observable<Result<Partial<QuestItemType>>> {
    return this.http.post<Result<Partial<QuestItemType>>>(
      `https://citytourist.azurewebsites.net/api/v1/quest-item-types/`,
      questItemTypeCreate,
      this.httpOptions
    );
  }
  deleteQuestItemTypeById(id: string): Observable<string | undefined> {
    return this.http
      .delete(
        `https://citytourist.azurewebsites.net/api/v1/quest-item-types/${id}`,
        this.httpOptions
      )
      .pipe(map((response: Result<QuestItemTypeListItem>) => response.status));
  }
}
