import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'query-string';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
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
  constructor(private http: HttpClient) {
    super();
  }

  httpOptions = {
    headers: new HttpHeaders({ encrypt: 'multipart/form-data' }),
  };

  getQuests(search: QuestListSearch): Observable<Paging<QuestListItem>> {
    var sortBy =
      `${search.sort?.sortBy}` === 'undefined' ? '' : search.sort?.sortBy;
    var sortDir =
      `${search?.sort?.dir}` === 'undefined' ? '' : search.sort?.dir;
    var language =
      `${search?.language}` === 'undefined' ? '1' : search?.language;
    const query = stringify({
      name: search.keyword,
      questTypeId: search?.questTypeIds == null ? 0 : search?.questTypeIds,
      pageNumber: isNaN(search?.currentPage!) ? 1 : search?.currentPage! + 1,
      pagesize: 10,
      orderby: `${sortBy} ${sortDir}`,
      language: language ? language : 0,
    });
    var result = this.http.get<Paging<QuestListItem>>(
      `${environment.apiUrl}/api/v1/quests?` + query,
      this.httpOptions
    );
    return result;
  }

  addQuest(quest: QuestCreate): Observable<Result<Quest>> {
    // let payload = new FormData();
    // payload.append('id', '0');
    // payload.append('id', quest.id.toString());
    // payload.append('title', quest.title);
    // payload.append('description', quest.description);
    // payload.append('price', quest.price.toString());
    // payload.append('estimatedTime', quest.estimatedTime);
    // payload.append('estimatedDistance', quest.estimatedDistance);
    // payload.append('image', quest.image);
    // payload.append('availableTime', quest.availableTime);
    // payload.append('createdDate', new Date().toDateString());
    // payload.append('updatedDate', '');
    // payload.append('status', quest.status);
    // payload.append('questTypeId', quest.questTypeId.toString());
    // payload.append('questOwnerId', quest.questOwnerId.toString());
    // payload.append('areaId', quest.areaId.toString());

    const { image, ...payload } = quest;
    return this.http.post<Result<Quest>>(
      `${environment.apiUrl}/api/v1/quests/`,
      this.toFormData(payload, image),
      this.httpOptions
    );
  }
  toFormData(quest: Partial<QuestCreate>, image: File): FormData {
    const formData = new FormData();
    const payload = {
      ...quest,
      id: quest.id || 0,
      createdate:quest.createdDate||'',
      updatedDate: quest.updatedDate || '',
    };

    Object.keys(payload).forEach((key) =>
      formData.append(key, (payload as any)[key])
    );
    if (image != null) {
      formData.append('Image', image);
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
    // let payload = new FormData();
    // payload.append('id', quest.id.toString());
    // payload.append('title', quest.title);
    // payload.append('description', quest.description);
    // payload.append('price', quest.price.toString());
    // payload.append('estimatedTime', quest.estimatedTime);
    // payload.append('estimatedDistance', quest.estimatedDistance);
    // payload.append('image', quest.image);
    // payload.append('availableTime', quest.availableTime);
    // payload.append('createdDate', new Date().toDateString());
    // payload.append('updatedDate', '');
    // payload.append('status', quest.status);
    // payload.append('questTypeId', quest.questTypeId.toString());
    // payload.append('questOwnerId', quest.questOwnerId.toString());
    // payload.append('areaId', quest.areaId.toString());

    
    const { image, ...payload } = quest;
    return this.http.put<Result<Quest>>(
      `${environment.apiUrl}/api/v1/quests/`,
      this.toFormData(payload, image),
      this.httpOptions
    );
  }
}
