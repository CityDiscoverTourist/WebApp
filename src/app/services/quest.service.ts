import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'query-string';
import { map, Observable, of } from 'rxjs';
// import { IdValue, Quest } from '../models';
import {
  Paging,
  Quest,
  QuestCreateResult,
  QuestData,
  QuestListItem,
  QuestListSearch,
  Result,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class QuestService {
  constructor(private http: HttpClient) {}

  // httpOptions = {
  //   headers: new HttpHeaders({ 'Content-Type': 'application/json' }).
  //   append('Content-Disposition', 'multipart/form-data'),
  // };

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  // getQuests(): Observable<Quest[]> {
  // return of(
  //   [1, 2, 3, 4, 5, 6, 7, 8].map(
  //     (i) =>
  //       ({
  //         id: i,
  //         title: `Lorem ipsum ${i}`,
  //         description: `Lorem ipsum dolor sit amet ${i}`,
  //         price: (i + 2) * 10000,
  //         estimatedTime: `Lorem ${i + 3}`,
  //         estimatedDistance: `Lorem ${i + 3}`,
  //         availableTime: new Date(),
  //         createdDate: new Date(),
  //         updatedDate: new Date(),
  //       } as Quest)
  //   )
  // );
  // }

  getQuests(search: QuestListSearch): Observable<Paging<QuestListItem>> {
    var sortBy =
      `${search.sort?.sortBy}` === 'undefined' ? '' : search.sort?.sortBy;
    var sortDir =
      `${search?.sort?.dir}` === 'undefined' ? '' : search.sort?.dir;
    const query = stringify({
      name: search.keyword,
      questtypeid: search?.questypes,
      pageNumber: isNaN(search?.currentPage!) ? 1 : search?.currentPage! + 1,
      pagesize: 10,
      orderby: `${sortBy} ${sortDir}`,
    });
    var result = this.http.get<Paging<QuestListItem>>(
      'https://citytourist.azurewebsites.net/api/v1/quests?' + query,
      this.httpOptions
    );
    return result;
  }

  addQuest(quest: QuestData) {
    const payload = new FormData();
    // payload.append('id',quest.id.toString());
    payload.append('id', '0');
    payload.append('title', quest.title);
    payload.append('description', quest.description);
    payload.append('price', quest.price.toString());
    payload.append('estimatedTime', quest.estimatedTime);
    payload.append('estimatedDistance', quest.estimatedDistance);
    payload.append('image', quest.image);
    // payload.append('availableTime',quest.availableTime.toTimeString());
    // payload.append('availableTime',new Date().toTimeString());
    payload.append('availableTime', '');
    // payload.append('createdDate',quest.createdDate.toTimeString());
    payload.append('createdDate', '');
    // payload.append('updatedDate',quest.updatedDate.toTimeString());
    payload.append('updatedDate', '');
    payload.append('status', quest.status);
    payload.append('questTypeId', quest.questTypeId.toString());
    payload.append('questOwnerId', quest.questOwnerId.toString());
    payload.append('areaId', quest.areaId.toString());
    // payload.append('questTypeId','1');
    // payload.append('questOwnerId','2');
    // payload.append('areaId','3');

    var test = 0;

    return this.http.post(
      `https://citytourist.azurewebsites.net/api/v1/quests/`,
      payload,
      // this.httpOptions
      this.httpOptions
    );
  }
  // addQuest(quest: QuestData): Observable<Pagination<Quest>> {
  //   console.log("hdhdhdh");

  //   return this.http.post<Pagination<Quest>>(
  //     `https://citytourist.azurewebsites.net/api/v1/quests/`,
  //     quest,
  //     this.httpOptions
  //   );
  // }
  getQuestById(id: string): Observable<QuestListItem> {
    return this.http
      .get<Result<QuestListItem>>(
        `https://citytourist.azurewebsites.net/api/v1/quests/${id}`,
        this.httpOptions
      )
      .pipe(
        map(
          (response: Result<QuestListItem>) =>
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
            } as QuestListItem)
        )
      );
  }
}
