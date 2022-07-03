import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'query-string';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Paging,
  Quest,
  QuestCreate,
  QuestCreateResult,
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
      language: language,
    });
    var result = this.http.get<Paging<QuestListItem>>(
      `${environment.apiUrl}/api/v1/quests?` + query,
      this.httpOptions
    );
    return result;
  }

  addQuest(quest: QuestCreate): Observable<Result<Quest>> {
    let payload = new FormData();
    payload.append('id', '0');
    payload.append('id', quest.id.toString());
    payload.append('title', quest.title);
    payload.append('description', quest.description);
    payload.append('price', quest.price.toString());
    payload.append('estimatedTime', quest.estimatedTime);
    payload.append('estimatedDistance', quest.estimatedDistance);
    payload.append('image', quest.image);
    payload.append('availableTime', quest.availableTime);
    payload.append('createdDate', new Date().toDateString());
    payload.append('updatedDate', '');
    payload.append('status', quest.status);
    payload.append('questTypeId', quest.questTypeId.toString());
    payload.append('questOwnerId', quest.questOwnerId.toString());
    payload.append('areaId', quest.areaId.toString());

    return this.http.post<Result<Quest>>(
      `${environment.apiUrl}/api/v1/quests/`,
      payload,
      this.httpOptions
    );
  }

  getQuestById(id: string | undefined): Observable<Quest> {
    return this.http
      .get<Result<Quest>>(
        `${environment.apiUrl}/api/v1/quests/${id}`,
        this.httpOptions
      )
      .pipe(
        map(
          (response: Result<Quest>) =>
            ({
              id: response.data?.id,
              title: response.data?.title,
              description: response.data?.description,
              price: response.data?.price,
              estimatedTime: response.data?.estimatedTime,
              estimatedDistance: response.data?.estimatedDistance,
              availableTime: response.data?.availableTime,
              createdDate: response.data?.createdDate,
              updatedDate: response.data?.updatedDate,
              status: response.data?.status,
              questTypeId: response.data?.questTypeId,
              questOwnerId: response.data?.questOwnerId,
              areaId: response.data?.areaId,
              imagePath: response.data?.imagePath,
            } as Quest)
        )
      );
  }
  deleteQuestById(id: string): Observable<string | undefined> {
    return this.http
      .delete<Result<QuestListItem>>(
        `${environment.apiUrl}/api/v1/quests/${id}`,
        this.httpOptions
      )
      .pipe(map((response: Result<QuestListItem>) => response.status));
  }

  updateQuest(quest: QuestCreate): Observable<QuestCreateResult> {
    let payload = new FormData();
    payload.append('id', quest.id.toString());
    payload.append('title', quest.title);
    payload.append('description', quest.description);
    payload.append('price', quest.price.toString());
    payload.append('estimatedTime', quest.estimatedTime);
    payload.append('estimatedDistance', quest.estimatedDistance);
    payload.append('image', quest.image);
    payload.append('availableTime', quest.availableTime);
    payload.append('createdDate', new Date().toDateString());
    payload.append('updatedDate', '');
    payload.append('status', quest.status);
    payload.append('questTypeId', quest.questTypeId.toString());
    // payload.append('questOwnerId', quest.questOwnerId.toString());
    payload.append('areaId', quest.areaId.toString());

    return this.http
      .put<Result<Quest>>(
        `${environment.apiUrl}/api/v1/quests/`,
        payload,
        this.httpOptions
      )
      .pipe(
        map(
          (response: Result<Quest>) =>
            ({ id: response.data?.id } as QuestCreateResult)
        )
      );
  }
}
