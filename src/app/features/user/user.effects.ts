import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { loadUsers, loadUsersFail, loadUsersSuccess } from './user.actions';
import { User } from './user.entity';
import { UserService } from './user.service';
import { editUsername } from '../auth/auth.actions';
import { EditUsernameComponent } from '../../components/dialog/edit-username/edit-username.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class UserEffects {
  userService: UserService = inject(UserService);
  dialog: MatDialog = inject(MatDialog);

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
