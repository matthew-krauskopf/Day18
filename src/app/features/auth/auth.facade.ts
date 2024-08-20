import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';
import { UserFacade } from '../user/user.facade';
import { login, logout, relogin } from './auth.actions';
import { selectUser } from './auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  store: Store = inject(Store);
  userFacade: UserFacade = inject(UserFacade);
  user$;
  userId$;

  constructor() {
    this.userId$ = this.store.select(selectUser);

    this.user$ = combineLatest([this.userId$, this.userFacade.users$]).pipe(
      map(([userId, users]) => users.find((u) => u.id == userId) ?? null)
    );
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
