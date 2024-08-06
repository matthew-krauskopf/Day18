import { Injectable } from '@angular/core';
import { User } from '../user/user.entity';
import { Message } from './message.entity';

@Injectable({
  providedIn: 'root',
})
export class MessageUtils {
  enableButtons(user: User | null, message: Message): Message {
    return {
      ...message,
      editable:
        !message.retwatAuthor && user && user.id === message.author
          ? true
          : false,
      deletable:
        !message.retwatAuthor &&
        user &&
        (user.id === message.author || user.permission.toString() == 'ADMIN')
          ? true
          : false,
    };
  }

  linkUserInfo(message: Message, users: User[]): Message {
    const user: User = users.filter((u) => u.id == message.author)[0];
    return {
      ...message,
      username: user.username ?? '',
      retwatUsername:
        users.find((u) => message.retwatAuthor == u.id)?.username ?? undefined,
      pic: user.pic ?? '',
      editable: false,
      deletable: false,
    };
  }

  popMessage(messages: Message[], message: Message) {
    return messages.filter((m) => !(m.uuid == message.uuid));
  }

  popTwat(messages: Message[], message: Message, user: User) {
    return messages.filter(
      (m) =>
        !(
          m.uuid == message.uuid &&
          m.tmstp != message.tmstp &&
          user.id == m.retwatAuthor
        )
    );
  }

  replaceMessage(messages: Message[], message: Message) {
    const newMessages = messages.filter(
      (m) => !(m.uuid == message.uuid && m.tmstp == message.tmstp)
    );
    newMessages.push(message);
    return newMessages;
  }

  addNewMessage(messages: Message[], author: User, text: string): Message[] {
    const newMsgArr = messages.slice();
    newMsgArr.push(this.createNewMessage(author, text));
    return newMsgArr;
  }

  addNewRetwat(messages: Message[], message: Message, user: User) {
    const newMsgArr = messages.slice();
    newMsgArr.push(this.createRetwat(user, message));
    return newMsgArr;
  }

  markUntwatted(messages: Message[], message: Message, user: User) {
    if (message.retwattedBy) {
      return this.replaceMessage(messages, {
        ...message,
        retwattedBy: message.retwattedBy.filter((rt) => rt != user.id),
      });
    } else {
      return messages;
    }
  }

  markRetwatted(messages: Message[], message: Message, user: User) {
    if (message.retwattedBy) {
      const retwatArr = message.retwattedBy.slice();
      retwatArr.push(user.id);
      return this.replaceMessage(messages, {
        ...message,
        retwattedBy: retwatArr,
      });
    } else {
      return messages;
    }
  }

  addNewComment(message: Message, author: User, text: string): Message {
    return this.createNewMessage(author, text, message.uuid);
  }

  attachComment(parent: Message, comment: Message) {
    const comments = parent.comments.slice();
    comments.push(comment.uuid);
    return {
      ...parent,
      comments: comments,
    };
  }

  linkMessageData(
    user: User | null,
    users: User[] | null,
    message: Message | null
  ): Message | null {
    if (message != null && users) {
      return {
        ...this.enableButtons(user, this.linkUserInfo(message, users)),
      };
    }
    return message;
  }

  linkMessagesData(
    user: User | null,
    users: User[] | null,
    messages: Message[] | null
  ) {
    const fullMessages: Message[] = [];
    messages?.forEach((m) => {
      if (users) {
        const author: User = users.filter((u) => u.id == m.author)[0];
        if (author) {
          fullMessages.push(
            this.enableButtons(user, this.linkUserInfo(m, users))
          );
        }
      }
    });
    return fullMessages.sort((a, b) => b.tmstp - a.tmstp);
  }

  getCurrentMessage(messages: Message[], uuid: string) {
    return messages.find((m) => m.uuid == uuid);
  }

  private createNewMessage(
    author: User,
    text: string,
    parent?: string
  ): Message {
    return {
      uuid: crypto.randomUUID(),
      parent: parent,
      comments: [],
      likedBy: [],
      retwatAuthor: undefined,
      retwattedBy: undefined,
      deletable: false,
      editable: false,
      tmstp: Date.now(),
      author: author.id,
      text: text,
      username: author.username,
      retwatUsername: undefined,
      pic: author.pic,
    };
  }

  private createRetwat(user: User, message: Message): Message {
    return {
      uuid: message.uuid,
      author: message.author,
      retwatAuthor: user.id,
      tmstp: Date.now(),
      text: message.text,

      parent: undefined,
      comments: [],
      likedBy: [],
      retwattedBy: undefined,
      deletable: false,
      editable: false,
      username: '',
      retwatUsername: undefined,
      pic: '',
    };
  }
}
