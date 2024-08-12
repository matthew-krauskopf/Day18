import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseAPIService } from '../base-api.service';
import { User } from '../user/user.entity';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseAPIService {
  endpoint = '/users';

  getUser(user: string): Observable<User[]> {
    return this.performGet(this.endpoint, { key: 'username', value: user });
  }
}
