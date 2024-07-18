import { inject, Injectable, OnInit } from '@angular/core';
import { StoreService } from './store.service';
import { UserService } from './http/user.service';
import { StoreType } from '../models/storeType';
import { User } from '../models/user';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade implements OnInit {
  store: StoreService = inject(StoreService);
  userService: UserService = inject(UserService);

  user$;

  ngOnInit(): void {}

  constructor() {
    this.user$ = this.store.watchUser().pipe(takeUntilDestroyed());
    this.userService
      .loadUser(this.store.getItem(StoreType.USER) ?? '')
      .subscribe((users: User[]) => {
        this.store.pushUser(users.length > 0 ? users[0] : null);
      });
  }

  performLogin(username: string, password: string) {
    this.userService.loadUser(username).subscribe((users) => {
      if (users.length > 0) {
        let user: User = users[0];
        if (user.username == username && user.password == password) {
          this.store.pushUser(users.length > 0 ? users[0] : null);
          this.store.storeItem(StoreType.USER, username);
        }
      }
    });
  }

  logout() {
    this.store.removeItem(StoreType.USER);
    this.store.pushUser(null);
  }
}
