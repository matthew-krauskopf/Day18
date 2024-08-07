import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

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
    endpoint: string[],
    ...params: string[]
  ): Observable<T[]> {
    return this.http
      .get<T[]>(
        this.baseUrl +
          endpoint.join('/') +
          (params.length > 0 ? '?' + params.join('&') : '')
      )
      .pipe(catchError(this.handleError<T[]>()));
  }
}
