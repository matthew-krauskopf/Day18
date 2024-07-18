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

  protected performGet(
    endpoint: string[],
    ...params: string[]
  ): Observable<[]> {
    return this.http
      .get<[]>(
        this.baseUrl +
          endpoint.join('/') +
          (params.length > 0 ? '?' + params.join('&') : '')
      )
      .pipe(catchError(this.handleError<[]>()));
  }
}
