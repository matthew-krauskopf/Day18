import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { User } from '../../models/user';
import {
  loadUsers,
  loadUsersFail,
  loadUsersSuccess,
} from '../actions/user.actions';
import { UserService } from '../http/user.service';
import { StoreService } from '../store.service';

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

  loadUsersSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsersSuccess),
      map((payload) =>
        this.storeService.pushUsers(payload.users.map(this.attachPhoto))
      )
    )
  );

  attachPhoto(user: User): User {
    return {
      ...user,
      pic: 'assets/profile-pics/{}.jpg'.replace('{}', String(user.id)),
    };
  }
}
