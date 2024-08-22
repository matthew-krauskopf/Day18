import { createReducer, on } from '@ngrx/store';
import { User } from '../user/user.entity';
import { deleteAuthUser, loginSuccess, logout } from './auth.actions';

export interface AuthState {
  userId: number | null;
}

export const authKey = 'auth';

export const authState: AuthState = {
  userId: null,
};

export const authReducer = createReducer(
  authState,
  on(loginSuccess, (state, { user }) => ({
    ...state,
    userId: user.id,
  })),
  on(logout, deleteAuthUser, (state) => ({
    ...state,
    userId: null,
  }))
);
