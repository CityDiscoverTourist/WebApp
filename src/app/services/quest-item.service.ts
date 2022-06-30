import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'query-string';
import { map, Observable, of } from 'rxjs';
import { Paging, QuestItem, QuestItemListSearch, Result } from '../models';
import {
  QuestItemCreate,
  QuestItemCreateResult,
  QuestItemListItem,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class QuestItemService {
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    // headers: new HttpHeaders({ encrypt: 'multipart/form-data' }),
  };

  getQuestItemsByQuestId(
    search: QuestItemListSearch
  ): Observable<Paging<QuestItemListItem>> {
    var sortBy =
      `${search.sort?.sortBy}` === 'undefined' ? '' : search.sort?.sortBy;
    var sortDir =
      `${search?.sort?.dir}` === 'undefined' ? '' : search.sort?.dir;
    const query = stringify({
      name: search.keyword,
      questId: search.questId,
      questItemTypeId: search?.questItemTypeIds,
      pageNumber: isNaN(search?.currentPage!) ? 1 : search?.currentPage! + 1,
      pagesize: 5,
      orderby: `${sortBy} ${sortDir}`,
    });
    var result = this.http.get<Paging<QuestItemListItem>>(
      `https://citytourist.azurewebsites.net/api/v1/quest-items?` + query,
      this.httpOptions
    );
    return result;
  }

  addQuestItem(
    questItemCreate: QuestItemCreate
  ): Observable<QuestItemCreateResult> {
    return this.http
      .post<Result<QuestItem>>(
        `https://citytourist.azurewebsites.net/api/v1/quest-items/`,
        questItemCreate,
        this.httpOptions
      )
      .pipe(
        map(
          (response: Result<QuestItem>) =>
            ({ id: response.data?.id } as QuestItemCreateResult)
        )
      );
  }

  deleteQuestItemById(id: string): Observable<string | undefined> {
    return this.http
      .delete<Result<QuestItemListItem>>(
        `https://citytourist.azurewebsites.net/api/v1/quest-items/${id}`,
        this.httpOptions
      )
      .pipe(map((response: Result<QuestItemListItem>) => response.status));
  }

  getQuestItemById(id: string | undefined): Observable<QuestItem> {
    return this.http
      .get<Result<QuestItem>>(
        `https://citytourist.azurewebsites.net/api/v1/quest-items/${id}`,
        this.httpOptions
      )
      .pipe(
        map(
          (response: Result<QuestItem>) =>
            ({
              id: response.data?.id,
              content: response.data?.content,
              description: response.data?.description,
              duration: response.data?.duration,
              createdDate: response.data?.createdDate,
              updatedDate: response.data?.updatedDate,
              // qrCode: response.data?.qrCode,
              // triggerMode: response.data?.triggerMode,
              rightAnswer: response.data?.rightAnswer,
              // answerImageUrl: response.data?.answerImageUrl,
              status: response.data?.status,
              questItemTypeId: response.data?.questItemTypeId,
              locationId: response.data?.locationId,
              questId: response.data?.questId,
              // itemId: response.data?.itemId,
            } as QuestItem)
        )
      );
  }
  updateQuestItemById(
    payload: Partial<QuestItemCreate>
  ): Observable<QuestItemCreateResult> {
    return this.http
      .put<Result<QuestItem>>(
        `https://citytourist.azurewebsites.net/api/v1/quest-items/`,
        payload,
        this.httpOptions
      )
      .pipe(
        map(
          (response: Result<QuestItem>) =>
            ({ id: response.data?.id } as QuestItemCreateResult)
        )
      );
  }
}
