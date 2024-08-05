import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { StoreType } from '../../model/enum/storeType';
import { StoreService } from '../../services/store.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { login, logout } from './auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  store: StoreService = inject(StoreService);
  userService: UserService = inject(UserService);
  router: Router = inject(Router);
  ngrxStore: Store = inject(Store);

  user$;

  constructor() {
    this.user$ = this.store.watchUser();
    this.userService
      .loadUser(this.store.getItem(StoreType.USER) ?? '')
      .subscribe((users: User[]) => {
        this.store.pushUser(users.length > 0 ? users[0] : null);
      });
  }

  performLogin(username: string, password: string) {
    this.ngrxStore.dispatch(login({ username, password }));
  }

  logout() {
    this.ngrxStore.dispatch(logout());
  }
}
