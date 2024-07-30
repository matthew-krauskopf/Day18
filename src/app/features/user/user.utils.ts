import { Injectable } from '@angular/core';
import { User } from './user.entity';

@Injectable({
  providedIn: 'root',
})
export class UserUtils {
  attachPhoto(user: User): User {
    return {
      ...user,
      pic: 'assets/profile-pics/{}.jpg'.replace('{}', String(user.id)),
    };
  }
}
