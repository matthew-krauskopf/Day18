import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { StoreService } from '../../services/store.service';
import { UserService } from './user.service';

import { Store } from '@ngrx/store';
import { loadUsers } from './user.actions';
import { UserUtils } from './user.utils';

@Injectable({
  providedIn: 'root',
})
export class UserFacade {
  store: StoreService = inject(StoreService);
  userService: UserService = inject(UserService);
  utils: UserUtils = inject(UserUtils);

  user$;
  users$;

  constructor(private ngrxStore: Store) {
    this.user$ = this.store.watchUser().pipe(
      takeUntilDestroyed(),
      map((user) => {
        return user != null ? this.utils.attachPhoto(user) : null;
      })
    );

    this.users$ = this.store.watchUsers().pipe(
      takeUntilDestroyed(),
      map((users) => {
        return users != null ? users.map(this.utils.attachPhoto) : null;
      })
    );
  }

  loadUsers() {
    if (!this.store.usersAreLoaded()) {
      this.ngrxStore.dispatch(loadUsers());
    }
  }
}
