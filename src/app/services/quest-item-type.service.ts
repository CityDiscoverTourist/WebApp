import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IdValue, QuestItemType } from '../models';
import { Pagination } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class QuestItemTypeService {

  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({ encrypt: 'multipart/form-data' }),
  };

  getQuestItemTypeIds(): Observable<IdValue[]> {
    var result= this.http
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
      var data=result.subscribe((data)=>{
        console.log(data);
      })
      return result;
  }
}
