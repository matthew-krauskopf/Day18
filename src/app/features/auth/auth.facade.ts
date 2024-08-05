import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { StoreService } from '../../services/store.service';
import { login, logout, relogin } from './auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  store: StoreService = inject(StoreService);
  ngrxStore: Store = inject(Store);

  user$;

  constructor() {
    this.user$ = this.store.watchUser();
  }

  performCachedLogin() {
    this.ngrxStore.dispatch(relogin());
  }

  performLogin(username: string, password: string) {
    this.ngrxStore.dispatch(login({ username, password }));
  }

  logout() {
    this.ngrxStore.dispatch(logout());
  }
}
