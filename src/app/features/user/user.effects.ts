import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { User } from './user.entity';
import { StoreService } from '../../services/store.service';
import { loadUsers, loadUsersFail, loadUsersSuccess } from './user.actions';
import { UserService } from './user.service';

@Injectable()
export class UserEffects {
  userService: UserService = inject(UserService);
  storeService: StoreService = inject(StoreService);

  constructor(private actions$: Actions) {}

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),
      exhaustMap(() =>
        this.userService.getUsers().pipe(
          map((users: User[]) => loadUsersSuccess({ users: users })),
          catchError(() => of(loadUsersFail()))
        )
      )
    )
  );

  loadUsersSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadUsersSuccess),
        tap((payload) =>
          this.storeService.pushUsers(payload.users.map(this.attachPhoto))
        )
      ),
    { dispatch: false }
  );

  attachPhoto(user: User): User {
    return {
      ...user,
      pic: 'assets/profile-pics/{}.jpg'.replace('{}', String(user.id)),
    };
  }
}
