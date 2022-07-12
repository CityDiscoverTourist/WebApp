import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'query-string';
import { map, of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { IdValue, Paging, Result, SearchInfo } from '../models';
import {
  QuestType,
  QuestTypeCreate,
  QuestTypeListItem,
  QuestTypeListSearch,
} from '../models/questtype.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class QuestTypeService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  httpOptions = {
    headers: new HttpHeaders({ encrypt: 'multipart/form-data' }),
  };
  getQuestTypeIdValue(): Observable<IdValue[]> {
    return this.http
      .get<Paging<QuestType>>(
        `${environment.apiUrl}/api/v1/quest-types`,
        this.httpOptions
      )
      .pipe(
        map((response: Paging<QuestType>) =>
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
    search: QuestTypeListSearch
  ): Observable<Paging<QuestTypeListItem>> {
    var sortBy =
      `${search.sort?.sortBy}` === 'undefined' ? '' : search.sort?.sortBy;
    var sortDir =
      `${search?.sort?.dir}` === 'undefined' ? '' : search.sort?.dir;
      var language =
      `${search?.language}` === 'undefined' ? '1' : search?.language;
    const query = stringify({
      name: search.keyword,
      pageNumber: isNaN(search?.currentPage!) ? 1 : search?.currentPage! + 1,
      pagesize: 10,
      orderby: `${sortBy} ${sortDir}`,
      status: search?.status,
      language: language ? language : 0,
    });
    var result = this.http.get<Paging<QuestTypeListItem>>(
      `${environment.apiUrl}/api/v1/quest-types?` + query,
      this.httpOptions
    );
    return result;
  }

  addQuestType(
    questTypeCreate: QuestTypeCreate
  ): Observable<Result<Partial<QuestType>>> {
    let payload = new FormData();
    payload.append('id', '0');
    payload.append('name', questTypeCreate.name.toString());
    payload.append('status', questTypeCreate.status);
    payload.append('image', questTypeCreate.image);
    return this.http.post<Result<Partial<QuestType>>>(
      `${environment.apiUrl}/api/v1/quest-types/`,
      payload,
      this.httpOptions
    );
  }
  deleteQuestTypeById(id: string): Observable<QuestTypeListItem | undefined> {
    return this.http
      .delete<Result<QuestTypeListItem>>(
        `${environment.apiUrl}/api/v1/quest-types/${id}`,
        this.httpOptions
      )
      .pipe(map((response: Result<QuestTypeListItem>) => response.data));
  }

  getQuestTypeById(id: string | undefined): Observable<QuestType> {
    return this.http
      .get<Result<QuestType>>(
        `${environment.apiUrl}/api/v1/quest-types/${id}/not-language`,
        this.httpOptions
      )
      .pipe(
        map(
          (response: Result<QuestType>) =>
            ({
              id: response.data?.id,
              name: response.data?.name,
              status: response.data?.status,
              imagePath: response.data?.imagePath,
            } as QuestType)
        )
      );
  }
  updateQuestTypeById(
    questTypeCreate: QuestTypeCreate
  ): Observable<Result<Partial<QuestType>>> {
    let payload = new FormData();
    payload.append('id', questTypeCreate.id.toString());
    payload.append('name', questTypeCreate.name.toString());
    payload.append('status', questTypeCreate.status);
    payload.append('image', questTypeCreate.image);
    return this.http.put<Result<Partial<QuestType>>>(
      `${environment.apiUrl}/api/v1/quest-types/`,
      payload,
      this.httpOptions
    );
  }
}
