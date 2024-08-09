import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.state';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUsers = createSelector(
  selectUserState,
  (userState: UserState) => {
    return userState.users;
  }
);

export const selectUser = createSelector(
  selectUserState,
  (userState: UserState) => {
    return userState.user;
  }
);
