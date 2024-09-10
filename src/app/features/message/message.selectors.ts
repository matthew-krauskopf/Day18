import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectAuthUser } from '../auth/auth.selectors';
import { AuthState } from '../auth/auth.state';
import { User } from '../user/user.entity';
import { UserState } from '../user/user.state';
import { Message } from './message.entity';
import { MessageState } from './message.state';
import { linkMessageData, linkMessagesData } from './message.utils';

export const selectAuthState = createFeatureSelector<AuthState>('auth');
export const selectMessageState =
  createFeatureSelector<MessageState>('messages');
export const selectUserState = createFeatureSelector<UserState>('user');

export const selectMessage = createSelector(
  selectAuthUser,
  selectMessageState,
  selectUserState,
  (user: User | null, messageState: MessageState, userState: UserState) => {
    return linkMessageData(
      user,
      userState.users,
      messageState.messages && messageState.messageId
        ? messageState.messages.find(
            (m) => m.uuid == messageState.messageId && !m.retwatAuthor
          ) ?? null
        : null
    );
  }
);

export const selectAuthor = createSelector(
  selectUserState,
  selectMessage,
  (userState, message) => {
    return userState.users.find((u) => u.id == message?.author) ?? null;
  }
);

export const selectMessages = createSelector(
  selectAuthUser,
  selectMessageState,
  selectUserState,
  (user: User | null, messageState: MessageState, userState: UserState) => {
    return linkMessagesData(
      user,
      userState.users,
      messageState.messages
    ).filter((m: Message) => m.parent == undefined || m.retwatAuthor);
  }
);

export const selectComments = createSelector(
  selectAuthUser,
  selectMessageState,
  selectUserState,
  (user: User | null, messageState: MessageState, userState: UserState) => {
    return linkMessagesData(
      user,
      userState.users,
      messageState.messageId && messageState.messages
        ? messageState.messages.filter(
            (m) => m.parent == messageState.messageId && !m.retwatAuthor
          )
        : messageState.messages.filter((m) => m.parent != undefined)
    );
  }
);

export const selectAllMessages = createSelector(
  selectAuthUser,
  selectMessageState,
  selectUserState,
  (user: User | null, messageState: MessageState, userState: UserState) => {
    return linkMessagesData(user, userState.users, messageState.messages);
  }
);

export const selectMessageFilter = createSelector(
  selectMessageState,
  (messageState: MessageState) => {
    return messageState.filter;
  }
);

export const selectFilteredMessages = createSelector(
  selectAllMessages,
  selectMessageFilter,
  selectUserState,
  (messages: Message[], filter: string | null, userState: UserState) => {
    let filteredMessages;
    switch (filter) {
      case 'twats':
        return (filteredMessages = messages.filter(
          (m) => m.author == userState.userId && !m.retwatAuthor && !m.parent
        ));
      case 'comments': //comments
        return (filteredMessages = messages.filter(
          (c) => c.author == userState.userId && c.parent && !c.retwatAuthor
        ));
      case 'retwats': //retwats
        return (filteredMessages = messages.filter((m) =>
          m.retwattedBy.includes(userState.userId ?? -1)
        ));

      case 'likes': // likes
        return (filteredMessages = messages.filter((m) =>
          m.likedBy.includes(userState.userId ?? -1)
        ));
      default:
        return messages;
    }
  }
);
