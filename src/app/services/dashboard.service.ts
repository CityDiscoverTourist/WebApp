import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { BaseService } from './base.service';

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
}
