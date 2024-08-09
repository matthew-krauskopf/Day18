import { createAction, props } from '@ngrx/store';
import { User } from './user.entity';

export const loadUser = createAction('[Login Page] Load User');
export const reloadUser = createAction('[Startup] Reload User');
export const loadUserSuccess = createAction('[Login Page] Load User Success');
export const loadUserFail = createAction('[Login Page] Load User Fail');

export const loadUsers = createAction('[Home] Load Users');
export const loadUsersSuccess = createAction(
  '[Home] Load Users Success',
  props<{ users: User[] }>()
);
export const loadUsersFail = createAction('[Home] Load Users Fail');

export const addLikeToUser = createAction(
  '[Action Bar] Add Like To User',
  props<{ user: User; uuid: string }>()
);
