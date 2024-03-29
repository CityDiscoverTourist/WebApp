import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'query-string';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import {
  Paging,
  Quest,
  QuestCreate,
  QuestListItem,
  QuestListSearch,
  Result,
} from '../models';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class QuestService extends BaseService {
  private _sharedHeaders = new HttpHeaders();
  constructor(private http: HttpClient) {
    super();
    this._sharedHeaders = this._sharedHeaders.set(
      'Content-Type',
      'application/json'
    );
  }

  httpOptions = {
    headers: new HttpHeaders({ encrypt: 'multipart/form-data' }),
  };

  getQuests(search: QuestListSearch): Observable<Paging<QuestListItem>> {
    var sortBy =
      `${search.sort?.sortBy}` === 'undefined' ? '' : search.sort?.sortBy;
    var sortDir =
      `${search?.sort?.dir}` === 'undefined' ? '' : search.sort?.dir;

    const query = stringify({
      name: search.keyword,
      questTypeId: search?.questTypeIds == null ? 0 : search?.questTypeIds,
      pageNumber: isNaN(search?.currentPage!) ? 1 : search?.currentPage! + 1,
      pagesize: 10,
      orderby: `${sortBy} ${sortDir}`,
    });
    var result = this.http.get<Paging<QuestListItem>>(
      `${environment.apiUrl}/api/v1/quests?` + query,
      this.httpOptions
    );
    return result;
  }

  addQuest(quest: QuestCreate): Observable<Result<Quest>> {
    var userId = localStorage.getItem('userId');
    const { image, ...payload } = quest;
    return this.http.post<Result<Quest>>(
      `${environment.apiUrl}/api/v1/quests?userId=${userId}`,
      this.toFormData(payload, image),
      this.httpOptions
    );
  }
  toFormData(quest: Partial<QuestCreate>, image: File): FormData {
    const formData = new FormData();
    const payload = {
      ...quest,
      id: quest.id || 0,
      createdate: quest.createdDate || '',
      updatedDate: quest.updatedDate || '',
      ImagePath: quest.imagePath,
    };

    Object.keys(payload).forEach((key) =>
      formData.append(key, (payload as any)[key])
    );
    if (image != null) {
      formData.append('Image', image);
    }
    return formData;
  }
  toFormDataUpdate(quest: Partial<QuestCreate>, image: File): FormData {
    const formData = new FormData();
    const payload = {
      ...quest,
      id: quest.id || 0,
      createdate: quest.createdDate || '',
      updatedDate: quest.updatedDate || '',
    };
    Object.keys(payload).forEach((key) =>
      formData.append(key, (payload as any)[key])
    );
    try {
      if (image.name.length>0) {
        formData.delete('imagePath');
        formData.append('image', image);
      } else {
        formData.delete('imagePath');
        formData.append('imagePath', quest.imagePath!);
      }
    } catch (error) {
      formData.delete('imagePath');
      formData.append('imagePath', quest.imagePath!);
    }
    return formData;
  }
  getQuestById(id: string | undefined): Observable<QuestListItem> {
    return this.http
      .get<Result<QuestListItem>>(
        `${environment.apiUrl}/api/v1/quests/${id}`,
        this.httpOptions
      )
      .pipe(map((response: Result<QuestListItem>) => response.data));
  }
  getQuestByIdNoLangue(id: string | undefined): Observable<QuestListItem> {
    return this.http
      .get<Result<QuestListItem>>(
        `${environment.apiUrl}/api/v1/quests/${id}/not-language`,
        this.httpOptions
      )
      .pipe(map((response: Result<QuestListItem>) => response.data));
  }
  deleteQuestById(id: string): Observable<QuestListItem | undefined> {
    return this.http
      .delete<Result<QuestListItem>>(
        `${environment.apiUrl}/api/v1/quests/${id}`,
        this.httpOptions
      )
      .pipe(map((response: Result<QuestListItem>) => response.data));
  }

  updateQuest(quest: QuestCreate): Observable<Result<Quest>> {
    const { image, ...payload } = quest;
    return this.http.put<Result<Quest>>(
      `${environment.apiUrl}/api/v1/quests/`,
      this.toFormDataUpdate(payload, image),
      this.httpOptions
    );
  }

  updateStatus(
    id: string,
    status: string
  ): Observable<QuestListItem | undefined> {
    return this.http
      .put<Result<QuestListItem>>(
        `${environment.apiUrl}/api/v1/quests/${
          status == 'Active' ? 'enable' : 'disable'
        }/${id}`,
        {
          headers: this._sharedHeaders,
        }
      )
      .pipe(map((response: Result<QuestListItem>) => response.data));
  }
}
