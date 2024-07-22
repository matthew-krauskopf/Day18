import { inject, Injectable, OnInit } from '@angular/core';
import { StoreService } from './store.service';
import { UserService } from './http/user.service';
import { StoreType } from '../models/storeType';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  store: StoreService = inject(StoreService);
  userService: UserService = inject(UserService);

  user$;
  loginSuccess$;

  constructor() {
    this.user$ = this.store.watchUser();
    this.loginSuccess$ = this.store.watchLoginSuccess();
    this.userService
      .loadUser(this.store.getItem(StoreType.USER) ?? '')
      .subscribe((users: User[]) => {
        if (users.length > 0) {
          this.attachPhoto(users[0]);
        }
        this.store.pushUser(users.length > 0 ? users[0] : null);
      });
  }

  performLogin(username: string, password: string) {
    this.userService.loadUser(username).subscribe((users) => {
      if (users.length > 0) {
        let user: User = users[0];
        if (user.username == username && user.password == password) {
          this.attachPhoto(user);
          this.store.pushUser(users.length > 0 ? users[0] : null);
          this.store.storeItem(StoreType.USER, username);
          this.store.pushLoginSuccess(true);
          return;
        }
      }
      // Emit null if login failed
      this.store.pushLoginSuccess(false);
    });
  }

  logout() {
    this.store.removeItem(StoreType.USER);
    this.store.pushLoginSuccess(null);
    this.store.pushUser(null);
  }

  attachPhoto(user: User) {
    user.pic = 'assets/profile-pics/{}.jpg'.replace('{}', String(user.id));
  }

  watchLoginSuccess() {
    return this.loginSuccess$;
  }
}
