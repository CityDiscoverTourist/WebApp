import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'query-string';
import { Observable } from 'rxjs';
import { CommentListSearch, Paging, Comment } from '../models';
import { BaseService } from './base.service';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root',
})
export class CommentService extends BaseService {
  private _sharedHeaders = new HttpHeaders();
  constructor(private http: HttpClient) {
    super();
    this._sharedHeaders = this._sharedHeaders.set(
      'Content-Type',
      'application/json'
    );
  }

  getComment(search: CommentListSearch): Observable<Paging<Comment>> {
    var sortBy =
      `${search.sort?.sortBy}` === 'undefined' ? '' : search.sort?.sortBy;
    var sortDir =
      `${search?.sort?.dir}` === 'undefined' ? '' : search.sort?.dir;
    const query = stringify({
      // customerEmail: search.keyword,
      pageNumber: isNaN(search?.currentPage!) ? 1 : search?.currentPage! + 1,
      pagesize: 10,
      orderby: `${sortBy} ${sortDir}`,
      isFeedbackApproved: search?.isFeedbackApproved,
    });
    var questId = localStorage.getItem('questId');
    var result = this.http.get<Paging<Comment>>(
      `${environment.apiUrl}/api/v1/customer-quests/show-comments/${questId}?` +
        query,
      { headers: this._sharedHeaders }
    );
    return result;
  }

  updateApprove(id: string): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/api/v1/customer-quests/approve-feedback/${id}`,
      { headers: this._sharedHeaders }
    );
  }
}
