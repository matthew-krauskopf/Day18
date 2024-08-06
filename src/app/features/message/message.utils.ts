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
      editable: user && user.id === message.author ? true : false,
      deletable:
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
      pic: user.pic ?? '',
      editable: false,
      deletable: false,
    };
  }

  popMessage(messages: Message[], message: Message) {
    return messages.filter((m) => m.uuid != message.uuid);
  }

  replaceMessage(messages: Message[], message: Message) {
    const newMessages = messages.filter((m) => m.uuid != message.uuid);
    newMessages.push(message);
    return newMessages;
  }

  addNewMessage(messages: Message[], author: User, text: string): Message[] {
    const newMsgArr = messages.slice();
    newMsgArr.push(this.createNewMessage(author, text));
    return newMsgArr;
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
      deletable: false,
      editable: false,
      tmstp: Date.now(),
      author: author.id,
      text: text,
      username: author.username,
      pic: author.pic,
    };
  }
}
