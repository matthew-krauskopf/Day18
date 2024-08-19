import { createReducer, on } from '@ngrx/store';
import { loginSuccess, logout } from '../auth/auth.actions';
import {
  addLike,
  addRetwat,
  removeLike,
  removeRetwat,
} from '../message/message.actions';
import { loadUsersSuccess, unloadUsers } from './user.actions';
import { User } from './user.entity';
import {
  addLikeToUserFn,
  addRetwatToUser,
  attachPhoto,
  removeLikeFromUserFn,
  removeRetwatFromUser,
} from './user.utils';

export interface UserState {
  user: User | null;
  users: User[];
}

export const userKey = 'user';

export const userState: UserState = {
  user: null,
  users: [],
};

export const userReducer = createReducer(
  userState,
  on(loadUsersSuccess, (state, { users }) => ({
    ...state,
    users: users.map(attachPhoto),
  })),
  on(addLike, (state, { message }) => ({
    ...state,
    user: addLikeToUserFn(state.user, message.uuid),
  })),
  on(removeLike, (state, { message }) => ({
    ...state,
    user: removeLikeFromUserFn(state.user, message.uuid),
  })),
  on(addRetwat, (state, { message }) => ({
    ...state,
    user: addRetwatToUser(state.user, message.uuid),
  })),
  on(removeRetwat, (state, { message }) => ({
    ...state,
    user: removeRetwatFromUser(state.user, message.uuid),
  })),
  on(loginSuccess, (state, { user }) => ({
    ...state,
    user: attachPhoto(user),
  })),
  on(logout, (state) => ({
    ...state,
    user: null,
  })),
  on(unloadUsers, (state) => ({
    ...state,
    users: [],
  }))
);
