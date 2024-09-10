import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectUserState } from '../user/user.selectors';
import { attachPhoto } from '../user/user.utils';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthUser = createSelector(
  selectAuthState,
  selectUserState,
  (authState, userState) => {
    let user = userState.users.find((u) => u.id == authState.userId);
    return user ? attachPhoto(user) : null;
  }
);
