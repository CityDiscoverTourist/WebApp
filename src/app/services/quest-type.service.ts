import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { IdValue, Result } from '../models';
import { Pagination } from '../models/pagination.model';
import { QuestType } from '../models/questtype.model';

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
  addQuestType(questType:Partial<QuestType>): Observable<Result<Partial<QuestType>>> {
    // return of({
    //   message:'',
    //   data: questType,
    //   status: 'data modified',
    // });
    return this.http.post<Result<Partial<QuestType>>>(
      `https://citytourist.azurewebsites.net/api/v1/quest-types/`,
      questType,
      this.httpOptions
    );
  }
}
