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

  users$;

  constructor(private store: Store) {
    this.users$ = this.store.select(selectUsers);
  }

  loadUsers() {
    this.store.dispatch(loadUsers());
  }

  unloadUsers() {
    this.store.dispatch(unloadUsers());
  }
}
