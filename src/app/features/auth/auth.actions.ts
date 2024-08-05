import { createAction, props } from '@ngrx/store';
import { User } from '../user/user.entity';

export const login = createAction(
  '[Login] Login',
  props<{ username: string; password: string }>()
);

export const relogin = createAction('[Startup] Relogin');

export const loginFetched = createAction(
  '[Login] Login Fetched',
  props<{ user: User; password: string }>()
);

export const loginSuccess = createAction(
  '[Login] Login Success',
  props<{ user: User }>()
);

export const loginRejected = createAction('[Login] Login Rejected');

export const loginFailed = createAction('[Login] Login Failed');

export const logout = createAction('[Login] Logout');
