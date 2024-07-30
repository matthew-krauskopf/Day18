import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { User } from './user.entity';
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
    this.user$ = this.store.watchUser().pipe(takeUntilDestroyed());
    this.users$ = this.store.watchUsers().pipe(takeUntilDestroyed());
  }

  watchUser(): Observable<User | null> {
    return this.user$;
  }

  watchUsers(): Observable<User[] | null> {
    return this.users$;
  }

  loadUsers() {
    if (!this.store.usersAreLoaded()) {
      this.ngrxStore.dispatch(loadUsers());
    }
  }
}
