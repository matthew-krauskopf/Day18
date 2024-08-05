import { Injectable } from '@angular/core';
import { User } from '../user/user.entity';

@Injectable({
  providedIn: 'root',
})
export class AuthUtils {
  performLogin(user: User, password: string) {
    return user.password == password;
  }
}
