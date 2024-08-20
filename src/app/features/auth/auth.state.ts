import { createReducer, on } from '@ngrx/store';
import { User } from '../user/user.entity';
import { loginSuccess, logout } from './auth.actions';

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
  on(logout, (state) => ({
    ...state,
    userId: null,
  }))
);
