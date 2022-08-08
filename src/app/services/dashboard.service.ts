import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { BaseService } from './base.service';
declare type Player = {
  email: string;
  point: string;
};
@Injectable({
  providedIn: 'root',
})
export class DashboardService extends BaseService {
  private _sharedHeaders = new HttpHeaders();
  constructor(private http: HttpClient) {
    super();
    this._sharedHeaders = this._sharedHeaders.set(
      'Content-Type',
      'application/json'
    );
  }

  getTotalRevenue(): Observable<string> {
    return this.http.get<string>(
      `${environment.apiUrl}/api/v1/dashboards/total-revenue`,
      { headers: this._sharedHeaders }
    );
  }
  getTotalUser(): Observable<string> {
    return this.http.get<string>(
      `${environment.apiUrl}/api/v1/dashboards/total-user`,
      { headers: this._sharedHeaders }
    );
  }
  getTotalQuest(): Observable<string> {
    return this.http.get<string>(
      `${environment.apiUrl}/api/v1/dashboards/total-quest`,
      { headers: this._sharedHeaders }
    );
  }
  getTopPlayer(): Observable<Player[]> {
    return this.http.get<Player[]>(`${environment.apiUrl}/api/v1/dashboards/`, {
      headers: this._sharedHeaders,
    });
  }
  getTopQuestPlay(): Observable<string[]> {
    return this.http.get<string[]>(
      `${environment.apiUrl}/api/v1/dashboards/top-play`,
      { headers: this._sharedHeaders }
    );
  }

  getTotalRevenueByYear(year:string):Observable<number[]> {
    return this.http.get<number[]>(
      `${environment.apiUrl}/api/v1/dashboards/revenue-all-month?year=${year}`,
      { headers: this._sharedHeaders }
    );
  }
}
