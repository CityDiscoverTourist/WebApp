import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Result, Suggestion } from '../models';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class SuggestionService extends BaseService {
  private _sharedHeaders = new HttpHeaders();
  constructor(private http: HttpClient) {
    super();
  }

  addSuggesion(
    payload: Partial<Suggestion>
  ): Observable<Result<Partial<Suggestion>>> {
    const suggestionCreate = {
      ...payload,
      id: payload.id || 0,
    };
    return this.http.post<Result<Partial<Suggestion>>>(
      `${environment.apiUrl}/api/v1/suggestions/`,
      payload,
      { headers: this._sharedHeaders }
    );
  }
  getSuggesionById(id: string | undefined): Observable<Suggestion> {
    return this.http
      .get<Result<Suggestion>>(
        `${environment.apiUrl}/api/v1/suggestions/${id}`,
        {
          headers: this._sharedHeaders,
        }
      )
      .pipe(map((response: Result<Suggestion>) => response.data));
  }

  updateSuggesionById(
    payload: Partial<Suggestion>
  ): Observable<Result<Partial<Suggestion>>> {
    return this.http.put<Result<Partial<Suggestion>>>(
      `${environment.apiUrl}/api/v1/suggestions/`,
      payload,
      { headers: this._sharedHeaders }
    );
  }
}
