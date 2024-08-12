import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { HttpParam } from '../model/http-param';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseAPIService {
  http: HttpClient = inject(HttpClient);

  constructor() {}

  baseUrl: string = 'https://json-server-vercel-ebon.vercel.app';

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.log('Fetch failed: ', error);
      return of(result as T);
    };
  }

  protected performGet<T>(
    endpoint: string,
    ...params: HttpParam[]
  ): Observable<T[]> {
    let options = new HttpParams();
    params.forEach((p) => {
      options = options.append(p.key, p.value);
    });
    return this.http
      .get<T[]>(this.baseUrl + endpoint, { params: options })
      .pipe(catchError(this.handleError<T[]>()));
  }
}
