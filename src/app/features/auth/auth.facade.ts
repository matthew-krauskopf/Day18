import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserFacade } from '../user/user.facade';
import { login, logout, relogin } from './auth.actions';
import { selectAuthUser } from './auth.selectors';

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

  performLogin(username: string, password: string) {
    this.store.dispatch(login({ username, password }));
  }

  logout() {
    this.store.dispatch(logout());
  }
}
