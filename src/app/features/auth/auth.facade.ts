import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserFacade } from '../user/user.facade';
import {
  confirmDeleteAuthUser,
  deleteAuthUser,
  login,
  loginFetched,
  logout,
  openEditUsername,
  relogin,
} from './auth.actions';
import { selectAuthUser } from './auth.selectors';
import { User } from '../user/user.entity';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  store: Store = inject(Store);
  userFacade: UserFacade = inject(UserFacade);
  user$;

  constructor() {
    this.user$ = this.store.select(selectAuthUser);
  }

  performCachedLogin() {
    this.store.dispatch(relogin());
  }

  performLogin(username: string, password: string, user: User | undefined) {
    this.store.dispatch(loginFetched({ user, password }));
  }

  logout() {
    this.store.dispatch(logout());
  }

  editUsername(user: User) {
    this.store.dispatch(openEditUsername({ user }));
  }

  confirmDeleteAuthUser(userId: number) {
    this.store.dispatch(confirmDeleteAuthUser({ authUserId: userId }));
  }
}
