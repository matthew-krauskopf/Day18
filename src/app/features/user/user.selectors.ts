import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.state';
import { attachPhoto } from './user.utils';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUsers = createSelector(
  selectUserState,
  (userState: UserState) => {
    return userState.users.map(attachPhoto);
  }
);

export const selectUser = createSelector(
  selectUserState,
  (userState: UserState) => {
    let user = userState.users.find((u) => u.id == userState.userId);
    return user ? attachPhoto(user) : user;
  }
);

export const selectAuthor = (authorId: number | undefined) =>
  createSelector(selectUserState, (userState) => {
    let user = userState.users.find((u) => u.id == authorId);
    return user ? attachPhoto(user) : user;
  });
