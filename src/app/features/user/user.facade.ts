import { inject, Injectable } from '@angular/core';
import { UserService } from './user.service';

import { Store } from '@ngrx/store';
import { loadUsers, unloadUsers } from './user.actions';
import { selectUser, selectUsers } from './user.selectors';

@Injectable({
  providedIn: 'root',
})
export class UserFacade {
  userService: UserService = inject(UserService);

  user$;
  users$;

  constructor(private store: Store) {
    this.user$ = this.store.select(selectUser);
    this.users$ = this.store.select(selectUsers);
  }

  loadUsers() {
    this.store.dispatch(loadUsers());
  }

  unloadUsers() {
    this.store.dispatch(unloadUsers());
  }
}
