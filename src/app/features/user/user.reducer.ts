import { createReducer, on } from '@ngrx/store';
import { addLikeToUser, loadUsersSuccess } from './user.actions';
import { UserState } from './user.state';
import { addLikeToUserFn, attachPhoto } from './user.utils';
import { addLike } from '../message/message.actions';

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
  }))
);
