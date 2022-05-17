import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IdValue, Quest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class QuestService {

  constructor(private http: HttpClient) {}

  getQuests():Observable<Quest[]>{
    return of(
      [1, 2, 3, 4, 5, 6, 7, 8].map(
        (i) =>
          ({
            id: i,
            title:`Lorem ipsum ${i}`,
            description:`Lorem ipsum dolor sit amet ${i}`,
            price:(i + 2) * 10000,
            estimatedTime: `Lorem ${i+3}`,
            estimatedDistance: `Lorem ${i+3}`,
            availableTime: new Date(),
            createdDate:new Date(),
            updatedDate:new Date(),
          } as Quest)
      )
    );
  }

  getCategories(): Observable<IdValue[]> {
    return of(
      [...Array(6).keys()].map(x => ({
        id: x,
        value: `Category ${x}`,
      })),
    );
  }
}
