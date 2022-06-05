import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'query-string';
import { map, Observable, of } from 'rxjs';
import { Paging, QuestItem, QuestItemListSearch, Result } from '../models';
import { QuestItemCreate, QuestItemCreateResult, QuestItemListItem } from '../models';

@Injectable({
  providedIn: 'root',
})
export class QuestItemService {
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  // getQuestItems(search: QuestItemListSearch): Observable<Paging<QuestItemListItem>> {
  //   var sortBy =
  //     `${search.sort?.sortBy}` === 'undefined' ? '' : search.sort?.sortBy;
  //   var sortDir =
  //     `${search?.sort?.dir}` === 'undefined' ? '' : search.sort?.dir;
  //   const query = stringify({
  //     name: search.keyword,
  //     // questItemTypeId: search?.questItemTypeIds,
  //     pageNumber: isNaN(search?.currentPage!) ? 1 : search?.currentPage! + 1,
  //     pagesize: 10,
  //     orderby: `${sortBy} ${sortDir}`,
  //   });
  //   var result = this.http.get<Paging<QuestItemListItem>>(
  //     'https://citytourist.azurewebsites.net/api/v1/quest-items?' + query,
  //     this.httpOptions
  //   );
  //   return result;
  // }

  getQuestItemsByQuestId(questId:string): Observable<Paging<QuestItemListItem>> {
    // var sortBy =
    //   `${search.sort?.sortBy}` === 'undefined' ? '' : search.sort?.sortBy;
    // var sortDir =
    //   `${search?.sort?.dir}` === 'undefined' ? '' : search.sort?.dir;
    // const query = stringify({
    //   name: search.keyword,
    //   // questItemTypeId: search?.questItemTypeIds,
    //   pageNumber: isNaN(search?.currentPage!) ? 1 : search?.currentPage! + 1,
    //   pagesize: 10,
    //   orderby: `${sortBy} ${sortDir}`,
    // });
    var result = this.http.get<Paging<QuestItemListItem>>(
      `https://citytourist.azurewebsites.net/api/v1/quest-items/get-by-quest-id/${questId}`,
      this.httpOptions
    );
    return result;
  }

  addQuestItem(questItemCreate:QuestItemCreate):Observable<QuestItemCreateResult>{
    var data= this.http
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
      var a=0;
      return data;
  }
}
