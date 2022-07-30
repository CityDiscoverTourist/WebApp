import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paging, Notification, SearchInfo } from '../models';
import { BaseService } from './base.service';
import { environment } from 'src/environments/environment.prod';
import { stringify } from 'query-string';

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
    var userId = localStorage.getItem('userId');
    var result = this.http.get<Paging<Notification>>(
      `${environment.apiUrl}/api/v1/notifications?userId=${userId}`,
      { headers: this._sharedHeaders }
    );
    return result;
  }
  getNotificationList(search: SearchInfo): Observable<Paging<Notification>> {
    var sortBy =
      `${search.sort?.sortBy}` === 'undefined' ? '' : search.sort?.sortBy;
    var sortDir =
      `${search?.sort?.dir}` === 'undefined' ? '' : search.sort?.dir;
    var userId = localStorage.getItem('userId');
    const query = stringify({
      userId: userId,
      pageNumber: isNaN(search?.currentPage!) ? 1 : search?.currentPage! + 1,
      pagesize: 10,
      orderby: `${sortBy} ${sortDir}`,
    });

    var result = this.http.get<Paging<Notification>>(
      `${environment.apiUrl}/api/v1/notifications?${query}`,
      { headers: this._sharedHeaders }
    );
    return result;
  }

  isReadNotification(): Observable<any> {
    var userId = localStorage.getItem('userId');
    return this.http.get<any>(
      `${environment.apiUrl}/api/v1/notifications/update-notify-status/${userId}`,
      { headers: this._sharedHeaders }
    );
  }
}
