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
  on(addLike, (state, { user, message }) => ({
    ...state,
    users: [
      ...state.users.filter((u) => u.id != user.id),
      addLikeToUserFn(user, message.uuid),
    ],
  })),
  on(removeLike, (state, { user, message }) => ({
    ...state,
    users: [
      ...state.users.filter((u) => u.id != user.id),
      removeLikeFromUserFn(user, message.uuid),
    ],
  })),
  on(addRetwat, (state, { user, message }) => ({
    ...state,
    users: [
      ...state.users.filter((u) => u.id != user.id),
      addRetwatToUser(user, message.uuid),
    ],
  })),
  on(removeRetwat, (state, { user, message }) => ({
    ...state,
    users: [
      ...state.users.filter((u) => u.id != user.id),
      removeRetwatFromUser(user, message.uuid),
    ],
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
