import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { StoreType } from '../../model/enum/storeType';
import { StoreService } from '../../services/store.service';
import {
  deleteAuthUser,
  login,
  loginFailed,
  loginFetched,
  loginRejected,
  loginSuccess,
  logout,
  relogin,
} from './auth.actions';
import { AuthService } from './auth.service';
import { performLogin } from './auth.utils';

@Injectable()
export class AuthEffects {
  authService: AuthService = inject(AuthService);
  localStorage: StoreService = inject(StoreService);
  router: Router = inject(Router);
  snackbar: MatSnackBar = inject(MatSnackBar);

  constructor(private actions$: Actions) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap((payload) =>
        this.authService.getUser(payload.username).pipe(
          map((user) => {
            if (user.length == 1) {
              return loginFetched({
                user: user[0],
                password: payload.password,
              });
            } else {
              return loginRejected();
            }
          }),
          catchError(() => of(loginFailed()))
        )
      )
    )
  );

  relogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(relogin),
      map(() => {
        const username = this.localStorage.getItem(StoreType.USER);
        if (username != null) {
          return login({
            username: username,
            password: this.localStorage.getItem(StoreType.PASSWORD) ?? '',
          });
        } else {
          return logout();
        }
      })
    )
  );

  loginFetched$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginFetched),
      map((payload) => {
        if (payload.user) {
          if (performLogin(payload.user, payload.password)) {
            return loginSuccess({ user: payload.user });
          } else {
            return loginRejected();
          }
        } else {
          return loginRejected();
        }
      })
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        map((payload) => {
          this.localStorage.storeItem(StoreType.USER, payload.user.username);
          this.localStorage.storeItem(
            StoreType.PASSWORD,
            payload.user.password
          );
          if (this.router.url.includes('login')) {
            this.router.navigate(['home', 'messages']);
          }
        })
      ),
    { dispatch: false }
  );

  loginRejected$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginRejected),
        map(() => {
          this.snackbar.open('Invalid Login Credentials', 'Close', {
            duration: 2000,
          });
        })
      ),
    { dispatch: false }
  );

  loginFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginFailed),
        map(() => {
          this.snackbar.open(
            'Unable to login. Please try again later',
            'Close',
            {
              duration: 2000,
            }
          );
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout, deleteAuthUser),
        tap(() => {
          this.localStorage.removeItem(StoreType.USER);
          this.localStorage.removeItem(StoreType.PASSWORD);
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
}
