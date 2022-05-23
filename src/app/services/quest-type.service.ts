import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { IdValue, Pagination, QuestType } from '../models';

@Injectable({
  providedIn: 'root'
})
export class QuestTypeService {

  constructor(private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
  };

  getAreaType(): Observable<IdValue[]> {
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
}
