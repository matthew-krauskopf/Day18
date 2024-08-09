import { createReducer, on } from '@ngrx/store';
import {
  addLike,
  addRetwat,
  removeLike,
  removeRetwat,
} from '../message/message.actions';
import { loadUsersSuccess } from './user.actions';
import { UserState } from './user.state';
import {
  addLikeToUserFn,
  addRetwatToUser,
  attachPhoto,
  removeLikeFromUserFn,
  removeRetwatFromUser,
} from './user.utils';

export const userKey = 'user';

export const userState: UserState = {
  user: null,
  users: null,
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
  }))
);
