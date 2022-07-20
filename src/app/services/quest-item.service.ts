import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'query-string';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

import {
  Paging,
  QuestItem,
  QuestItemCreate,
  QuestItemListItem,
  QuestItemListSearch,
  Result,
} from '../models';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class QuestItemService extends BaseService {
  private _sharedHeaders = new HttpHeaders();
  constructor(private http: HttpClient) {
    super();
  }
  httpOptions = {
    headers: new HttpHeaders({ encrypt: 'multipart/form-data' }),
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
      `${environment.apiUrl}/api/v1/quest-items?` + query,
      this.httpOptions
    );
    return result;
  }

  addQuestItem(
    questItemCreate: QuestItemCreate
  ): Observable<Result<QuestItem>> {
    const { image, ...payload } = questItemCreate;

    return this.http.post<Result<QuestItem>>(
      `${environment.apiUrl}/api/v1/quest-items/`,
      this.toFormData(payload, image),
      this.httpOptions
    );
  }

  toFormData(questItem: Partial<QuestItem>, image: File[]): FormData {
    const formData = new FormData();
    const payload = {
      ...questItem,
      itemId: questItem.itemId || 0,
      duration: questItem.itemId || 0,
      triggerMode: questItem.triggerMode || 0,
      updatedDate: questItem.updatedDate || '',
    };
    Object.keys(payload).forEach((key) =>
      formData.append(key, (payload as any)[key])
    );
    if (image?.length > 0) {
      for (let f of image) {
        formData.append('Image', f, f.name);
      }
    }
    return formData;
  }

  deleteQuestItemById(id: string): Observable<string | undefined> {
    return this.http
      .delete<Result<QuestItemListItem>>(
        `${environment.apiUrl}/api/v1/quest-items/${id}/`,
        this.httpOptions
      )
      .pipe(map((response: Result<QuestItemListItem>) => response.status));
  }

  getQuestItemById(id: number | undefined): Observable<QuestItemListItem> {
    return this.http
      .get<Result<QuestItemListItem>>(
        `${environment.apiUrl}/api/v1/quest-items/${id}/not-language/`,
        this.httpOptions
      )
      .pipe(map((response: Result<QuestItemListItem>) => response.data));
  }
  updateQuestItemById(
    questItemCreate: QuestItemCreate
  ): Observable<Result<QuestItem>> {
    const { image, ...payload } = questItemCreate;
    return this.http.put<Result<QuestItem>>(
      `${environment.apiUrl}/api/v1/quest-items/`,
      this.toFormData(payload, image),
      this.httpOptions
    );
  }
}
