import { inject, Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { UserService } from './http/user.service';
import { User } from '../models/user';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserFacade {
  store: StoreService = inject(StoreService);
  userService: UserService = inject(UserService);

  user$;
  users$;

  constructor() {
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
    this.userService
      .loadUsers()
      .pipe(map(this.attachPhotos))
      .subscribe((users: User[]) => {
        this.store.pushUsers(users.length > 0 ? users : null);
      });
  }

  attachPhotos(users: User[]): User[] {
    users.forEach(
      (u) => (u.pic = 'assets/profile-pics/{}.jpg'.replace('{}', String(u.id)))
    );
    return users;
  }
}
