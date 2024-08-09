import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { login, logout, relogin } from './auth.actions';
import { selectUser } from './auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  store: Store = inject(Store);
  user$;

  constructor() {
    this.user$ = this.store.select(selectUser);
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
