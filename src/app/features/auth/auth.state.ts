import { createReducer, on } from '@ngrx/store';
import { User } from '../user/user.entity';
import { loginSuccess, logout } from './auth.actions';

export interface AuthState {
  user: User | null;
}

export const authKey = 'auth';

export const authState: AuthState = {
  user: null,
};

export const authReducer = createReducer(
  authState,
  on(loginSuccess, (state, { user }) => ({
    ...state,
    user: user,
  })),
  on(logout, (state) => ({
    ...state,
    user: null,
  }))
);
