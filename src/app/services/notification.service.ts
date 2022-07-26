import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paging, Result } from '../models';
import { BaseService } from './base.service';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class NotificationService extends BaseService {
  private _sharedHeaders = new HttpHeaders();
  constructor(private http: HttpClient) {
    super();
    this._sharedHeaders = this._sharedHeaders.set(
      'Content-Type',
      'application/json'
    );
  }

  getNotifications(): Observable<Paging<Notification>> {
    var result = this.http.get<Paging<Notification>>(
      `${environment.apiUrl}/api/v1/notifications?`,
      { headers: this._sharedHeaders }
    );
    return result;
  }
}
