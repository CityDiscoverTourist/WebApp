import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'query-string';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Paging, Reward, RewardListSearch } from '../models';
import { BaseService } from './base.service';
@Injectable({
  providedIn: 'root',
})
export class RewardService extends BaseService {
  private _sharedHeaders = new HttpHeaders();
  constructor(private http: HttpClient) {
    super();
    this._sharedHeaders = this._sharedHeaders.set(
      'Content-Type',
      'application/json'
    );
  }

  getRewards(search: RewardListSearch): Observable<Paging<Reward>> {
    var sortBy =
      `${search.sort?.sortBy}` === 'undefined' ? '' : search.sort?.sortBy;
    var sortDir =
      `${search?.sort?.dir}` === 'undefined' ? '' : search.sort?.dir;

    const query = stringify({
      name: !search.keyword?.includes('@') ? search.keyword : undefined,
      customerEmail: search.keyword?.includes('@') ? search.keyword : undefined,
      status: search?.status,
      pageNumber: isNaN(search?.currentPage!) ? 1 : search?.currentPage! + 1,
      pagesize: 10,
      orderby: `${sortBy} ${sortDir}`,
    });

    var result = this.http.get<Paging<Reward>>(
      `${environment.apiUrl}/api/v1/rewards?` + query,
      { headers: this._sharedHeaders }
    );
    return result;
  }
}
