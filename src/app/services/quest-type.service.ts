import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'query-string';
import { map, of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { IdValue, Paging, Result, SearchInfo } from '../models';
import { Pagination } from '../models/pagination.model';
import { QuestType, QuestTypeCreate, QuestTypeListItem } from '../models/questtype.model';

@Injectable({
  providedIn: 'root'
})
export class QuestTypeService {

  constructor(private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
  };

  getQuestType(): Observable<IdValue[]> {
    return this.http
      .get<Pagination<QuestType>>(
        'https://citytourist.azurewebsites.net/api/v1/quest-types',
        this.httpOptions
      )
      .pipe(
        map((response: Pagination<QuestType>) =>
          [...response.data].map(
            (i) =>
              ({
                id: i.id,
                value: `${i.name}`,
              } as IdValue)
          )
        )
      );
  }
  
  getQuestTypes(
    search: SearchInfo
  ): Observable<Paging<QuestTypeListItem>> {
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
    var result = this.http.get<Paging<QuestTypeListItem>>(
      'https://citytourist.azurewebsites.net/api/v1/quest-types?' + query,
      this.httpOptions
    );
    return result;
  }

  addQuestType(
    payload: Partial<QuestTypeCreate>
  ): Observable<Result<Partial<QuestType>>> {
    return this.http.post<Result<Partial<QuestType>>>(
      `https://citytourist.azurewebsites.net/api/v1/quest-types/`,
      payload,
      this.httpOptions
    );
  }
  deleteQuestTypeById(id: string): Observable<string | undefined> {
    return this.http
      .delete(
        `https://citytourist.azurewebsites.net/api/v1/quest-types/${id}`,
        this.httpOptions
      )
      .pipe(map((response: Result<QuestTypeListItem>) => response.status));
  }

  getQuestTypeById(id: string | undefined): Observable<QuestType> {
    return this.http
      .get<Result<QuestType>>(
        `https://citytourist.azurewebsites.net/api/v1/quest-types/${id}`,
        this.httpOptions
      )
      .pipe(
        map(
          (response: Result<QuestType>) =>
            ({
              id: response.data?.id,
              name: response.data?.name,
              status: response.data?.status,
            } as QuestType)
        )
      );
  }
  updateQuestTypeById(
    payload: Partial<QuestTypeCreate>
  ): Observable<Result<Partial<QuestType>>> {
    return this.http.put<Result<Partial<QuestType>>>(
      `https://citytourist.azurewebsites.net/api/v1/quest-types/`,
      payload,
      this.httpOptions
    );
  }

}

