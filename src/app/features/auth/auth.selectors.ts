import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';
import { selectUserState } from '../user/user.selectors';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthUser = createSelector(
  selectAuthState,
  selectUserState,
  (authState, userState) => {
    return userState.users.find((u) => u.id == authState.userId) ?? null;
  }
);
