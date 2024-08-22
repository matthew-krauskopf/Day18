import { inject, Injectable } from '@angular/core';
import { UserService } from './user.service';

import { Store } from '@ngrx/store';
import { loadUser, loadUsers, unloadUser, unloadUsers } from './user.actions';
import { selectUser, selectUsers } from './user.selectors';

@Injectable({
  providedIn: 'root',
})
export class UserFacade {
  userService: UserService = inject(UserService);

  users$;
  user$;

  constructor(private store: Store) {
    this.users$ = this.store.select(selectUsers);
    this.user$ = this.store.select(selectUser);
  }

  loadUsers() {
    this.store.dispatch(loadUsers());
  }

  unloadUsers() {
    this.store.dispatch(unloadUsers());
  }

  loadUser(userId: number) {
    this.store.dispatch(loadUser({ userId }));
  }

  unloadUser() {
    this.store.dispatch(unloadUser());
  }
}
