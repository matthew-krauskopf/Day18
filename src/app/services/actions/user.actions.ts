import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user';

export const loadUser = createAction('[Login Page] Load User');
export const loadUserSuccess = createAction('[Login Page] Load User Success');
export const loadUserFail = createAction('[Login Page] Load User Fail');

export const loadUsers = createAction('[Home] Load Users');
export const loadUsersSuccess = createAction(
  '[Home] Load Users Success',
  props<{ users: User[] }>()
);
export const loadUsersFail = createAction('[Home] Load Users Fail');
