import { createAction, props } from '@ngrx/store';
import { User } from './user.entity';

export const loadUser = createAction(
  '[Profile] Load User',
  props<{ userId: number }>()
);
export const unloadUser = createAction('[Profile] Unload User');

export const loadUsers = createAction('[Home] Load Users');
export const loadUsersSuccess = createAction(
  '[Home] Load Users Success',
  props<{ users: User[] }>()
);
export const loadUsersFail = createAction('[Home] Load Users Fail');

export const unloadUsers = createAction('[Home] Unload Users');

export const addLikeToUser = createAction(
  '[Action Bar] Add Like To User',
  props<{ user: User; uuid: string }>()
);
