import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '../user/user.state';
import { Message } from './message.entity';
import { MessageState } from './message.state';
import { linkMessageData, linkMessagesData } from './message.utils';

export const selectMessageState =
  createFeatureSelector<MessageState>('messages');
export const selectUserState = createFeatureSelector<UserState>('user');

export const selectMessage = createSelector(
  selectMessageState,
  selectUserState,
  (messageState: MessageState, userState: UserState) => {
    return linkMessageData(
      userState.user,
      userState.users,
      messageState.messages && messageState.messageId
        ? messageState.messages.find(
            (m) => m.uuid == messageState.messageId && !m.retwatAuthor
          ) ?? null
        : null
    );
  }
);

export const selectMessages = createSelector(
  selectMessageState,
  selectUserState,
  (messageState: MessageState, userState: UserState) => {
    return linkMessagesData(
      userState.user,
      userState.users,
      messageState.messages
    ).filter((m: Message) => m.parent == undefined || m.retwatAuthor);
  }
);

export const selectComments = createSelector(
  selectMessageState,
  selectUserState,
  (messageState: MessageState, userState: UserState) => {
    return linkMessagesData(
      userState.user,
      userState.users,
      messageState.messageId && messageState.messages
        ? messageState.messages.filter(
            (m) => m.parent == messageState.messageId && !m.retwatAuthor
          )
        : messageState.messages
    );
  }
);
