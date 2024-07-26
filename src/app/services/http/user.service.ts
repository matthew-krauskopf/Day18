import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { BaseAPIService } from './base-api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseAPIService {
  endpoint = '/users';

  loadUser(user: string): Observable<User[]> {
    return this.performGet([this.endpoint], 'username={}'.replace('{}', user));
  }

  getUsers(): Observable<User[]> {
    return this.performGet([this.endpoint]);
  }
}
