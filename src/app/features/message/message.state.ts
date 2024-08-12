import { createReducer, on } from '@ngrx/store';
import {
  addComment,
  addLike,
  addMessage,
  addRetwat,
  deleteMessage,
  editMessage,
  loadMessagesSuccess,
  loadMessageSuccess,
  removeLike,
  removeRetwat,
  saveEdittedMessage,
  unloadMessage,
  unloadMessages,
} from './message.actions';
import { Message } from './message.entity';
import {
  addLikeToMessageFn,
  addNewComment,
  addNewMessage,
  addRetwatFn,
  popMessage,
  removeLikeFromMessageFn,
  removeRetwatFn,
  replaceMessage,
} from './message.utils';

export interface MessageState {
  messageId: string | null;
  messages: Message[] | null;
}

export const messageKey = 'message';

export const messageState: MessageState = {
  messageId: null,
  messages: null,
};

export const messageReducer = createReducer(
  messageState,
  on(loadMessagesSuccess, (state, { messages }) => ({
    ...state,
    messages: messages,
  })),
  on(loadMessageSuccess, (state, { message }) => ({
    ...state,
    messageId: message.uuid,
  })),
  on(unloadMessage, (state) => ({ ...state, message: null })),
  on(unloadMessages, (state) => ({ ...state, messages: null })),
  on(addMessage, (state, { messageText, user }) => ({
    ...state,
    messages: addNewMessage(
      state.messages != null ? state.messages : [],
      user,
      messageText
    ),
  })),
  on(saveEdittedMessage, (state, { message }) => ({
    ...state,
    messages: replaceMessage(state.messages, message),
  })),
  on(deleteMessage, (state, { message }) => ({
    ...state,
    messages: popMessage(state.messages, message),
  })),
  on(addComment, (state, { user, message, messageText }) => ({
    ...state,
    messages: addNewComment(state.messages, message, user, messageText),
  })),
  on(addLike, (state, { user, message }) => ({
    ...state,
    messages: addLikeToMessageFn(state.messages, message, user),
  })),
  on(removeLike, (state, { user, message }) => ({
    ...state,
    messages: removeLikeFromMessageFn(state.messages, message, user),
  })),
  on(addRetwat, (state, { user, message }) => ({
    ...state,
    messages: addRetwatFn(state.messages, message, user),
  })),
  on(removeRetwat, (state, { user, message }) => ({
    ...state,
    messages: removeRetwatFn(state.messages, message, user),
  }))
);
