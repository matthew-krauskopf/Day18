import { createReducer, on } from '@ngrx/store';
import {
  deleteAuthUser,
  editUsername,
  loginSuccess,
  logout,
} from '../auth/auth.actions';
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
import { markUserDeleted } from './user.utils';

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
    users: users,
  })),
  on(addLike, (state, { user, message }) => ({
    ...state,
    users: [
      ...state.users.filter((u) => u.id != user.id),
      {
        ...user,
        likedMessages: [...user.likedMessages, message.uuid],
      },
    ],
  })),
  on(removeLike, (state, { user, message }) => ({
    ...state,
    users: [
      ...state.users.filter((u) => u.id != user.id),
      {
        ...user,
        likedMessages: user.likedMessages.filter((m) => m != message.uuid),
      },
    ],
  })),
  on(addRetwat, (state, { user, message }) => ({
    ...state,
    users: [
      ...state.users.filter((u) => u.id != user.id),
      {
        ...user,
        retwats: [...user.retwats, message.uuid],
      },
    ],
  })),
  on(removeRetwat, (state, { user, message }) => ({
    ...state,
    users: [
      ...state.users.filter((u) => u.id != user.id),
      {
        ...user,
        retwats: user.retwats.filter((rt) => rt != message.uuid),
      },
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
  })),
  on(editUsername, (state, { user }) => ({
    ...state,
    users: [...state.users.filter((u) => u.id != user.id), user],
  }))
);
