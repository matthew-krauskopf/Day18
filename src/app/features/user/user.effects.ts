import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { StoreService } from '../../services/store.service';
import { loadUsers, loadUsersFail, loadUsersSuccess } from './user.actions';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserUtils } from './user.utils';

@Injectable()
export class UserEffects {
  userService: UserService = inject(UserService);
  storeService: StoreService = inject(StoreService);
  utils: UserUtils = inject(UserUtils);

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
}
