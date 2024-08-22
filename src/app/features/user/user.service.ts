import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseAPIService } from '../base-api.service';
import { User } from './user.entity';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseAPIService {
  endpoint = '/users';

  getUsers(): Observable<User[]> {
    return this.performGet(this.endpoint);
  }
}
