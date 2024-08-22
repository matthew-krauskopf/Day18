import { createReducer, on } from '@ngrx/store';
import { deleteAuthUser, loginSuccess, logout } from '../auth/auth.actions';
import {
  addLike,
  addRetwat,
  removeLike,
  removeRetwat,
} from '../message/message.actions';
import {
  loadUser,
  loadUsersSuccess,
  unloadUser,
  unloadUsers,
} from './user.actions';
import { User } from './user.entity';
import {
  addLikeToUserFn,
  addRetwatToUser,
  attachPhoto,
  markUserDeleted,
  removeLikeFromUserFn,
  removeRetwatFromUser,
} from './user.utils';

export interface UserState {
  userId: number | null;
  users: User[];
}

export const userKey = 'user';

export const userState: UserState = {
  userId: null,
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
  on(unloadUsers, (state) => ({
    ...state,
    users: [],
  })),
  on(loadUser, (state, { userId }) => ({
    ...state,
    userId: userId,
  })),
  on(unloadUser, (state) => ({
    ...state,
    userId: null,
  })),
  on(deleteAuthUser, (state, { authUserId }) => ({
    ...state,
    users: markUserDeleted(state.users, authUserId),
  }))
);
