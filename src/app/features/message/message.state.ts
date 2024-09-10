import { createReducer, on } from '@ngrx/store';
import {
  addComment,
  addLike,
  addMessage,
  addRetwat,
  applyFilter,
  deleteMessage,
  loadMessagesSuccess,
  loadMessageSuccess,
  removeFilter,
  removeLike,
  removeRetwat,
  saveEdittedMessage,
  unloadMessage,
  unloadMessages,
} from './message.actions';
import { Message } from './message.entity';
import {
  addNewComment,
  addRetwatFn,
  createNewMessage,
  removeRetwatFn,
  replaceMessage,
} from './message.utils';
import { loadUser } from '../user/user.actions';

export interface MessageState {
  messageId: string | null;
  messages: Message[];
  filter: string | null;
}

export const messageKey = 'message';

export const currentMessage: MessageState = {
  messageId: null,
  messages: [],
  filter: null,
};

export const messageReducer = createReducer(
  currentMessage,
  on(loadMessagesSuccess, (state, { messages }) => ({
    ...state,
    messages: messages,
  })),
  on(loadMessageSuccess, (state, { message }) => ({
    ...state,
    messageId: message.uuid,
  })),
  on(unloadMessage, (state) => ({ ...state, message: null })),
  on(unloadMessages, (state) => ({ ...state, messages: [] })),
  on(addMessage, (state, { messageText, user }) => ({
    ...state,
    messages: [...state.messages, createNewMessage(user, messageText)],
  })),
  on(saveEdittedMessage, (state, { message }) => ({
    ...state,
    messages: replaceMessage(state.messages, message),
  })),
  on(deleteMessage, (state, { message }) => ({
    ...state,
    messages: state.messages.filter((m) => !(m.uuid == message.uuid)),
  })),
  on(addComment, (state, { user, message, messageText }) => ({
    ...state,
    messages: addNewComment(state.messages, message, user, messageText),
  })),
  on(addLike, (state, { user, message }) => ({
    ...state,
    messages: replaceMessage(state.messages, {
      ...message,
      likedBy: [...message.likedBy, user.id],
    }),
  })),
  on(removeLike, (state, { user, message }) => ({
    ...state,
    messages: replaceMessage(state.messages, {
      ...message,
      likedBy: message.likedBy.filter((m) => m != user.id),
    }),
  })),
  on(addRetwat, (state, { user, message }) => ({
    ...state,
    messages: addRetwatFn(state.messages, message, user),
  })),
  on(removeRetwat, (state, { user, message }) => ({
    ...state,
    messages: removeRetwatFn(state.messages, message, user),
  })),
  on(applyFilter, (state, { filter }) => ({
    ...state,
    filter: filter,
  })),
  on(removeFilter, (state) => ({
    ...state,
    filter: null,
  })),
  on(loadUser, (state) => ({
    ...state,
    filter: 'twats',
  }))
);
