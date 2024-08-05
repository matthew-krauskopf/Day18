import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { StoreService } from '../../services/store.service';
import { UserService } from './user.service';

import { Store } from '@ngrx/store';
import { loadUsers } from './user.actions';

@Injectable({
  providedIn: 'root',
})
export class UserFacade {
  store: StoreService = inject(StoreService);
  userService: UserService = inject(UserService);

  user$;
  users$;

  constructor(private ngrxStore: Store) {
    this.user$ = this.store.watchUser().pipe(
      takeUntilDestroyed(),
      map((user) => {
        return user == null
          ? null
          : {
              ...user,
              pic: 'assets/profile-pics/{}.jpg'.replace('{}', String(user.id)),
            };
      })
    );
    this.users$ = this.store.watchUsers();
  }

  loadUsers() {
    if (!this.store.usersAreLoaded()) {
      this.ngrxStore.dispatch(loadUsers());
    }
  }
}
