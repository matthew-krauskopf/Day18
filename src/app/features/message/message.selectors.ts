import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectAuthUser } from '../auth/auth.selectors';
import { AuthState } from '../auth/auth.state';
import { User } from '../user/user.entity';
import { UserState } from '../user/user.state';
import { attachPhoto } from '../user/user.utils';
import { Message } from './message.entity';
import { MessageState } from './message.state';
import { enableButtons, linkMessagesData, linkUserInfo } from './message.utils';

export const selectAuthState = createFeatureSelector<AuthState>('auth');
export const selectMessageState =
  createFeatureSelector<MessageState>('messages');
export const selectUserState = createFeatureSelector<UserState>('user');

export const selectMessage = createSelector(
  selectAuthUser,
  selectMessageState,
  selectUserState,
  (user: User | null, messageState: MessageState, userState: UserState) => {
    let message =
      messageState.messages && messageState.messageId
        ? messageState.messages.find(
            (m) => m.uuid == messageState.messageId && !m.retwatAuthor
          ) ?? null
        : null;

    return message
      ? enableButtons(user, linkUserInfo(message, userState.users))
      : message;
  }
);

export const selectAuthor = createSelector(
  selectUserState,
  selectMessage,
  (userState, message) => {
    let user = userState.users.find((u) => u.id == message?.author);
    return user ? attachPhoto(user) : null;
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
    switch (filter) {
      case 'twats':
        return messages.filter(
          (m) => m.author == userState.userId && !m.retwatAuthor && !m.parent
        );
      case 'comments': //comments
        return messages.filter(
          (c) => c.author == userState.userId && c.parent && !c.retwatAuthor
        );
      case 'retwats': //retwats
        return messages.filter((m) =>
          m.retwattedBy.includes(userState.userId ?? -1)
        );

      case 'likes': // likes
        return messages.filter((m) =>
          m.likedBy.includes(userState.userId ?? -1)
        );
      default:
        return messages;
    }
  }
);
