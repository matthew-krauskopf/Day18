import { User } from '../user/user.entity';
import { Message } from './message.entity';

export function linkMessageData(
  user: User | null,
  users: User[] | null,
  message: Message | null
): Message | null {
  if (message != null && users) {
    return {
      ...enableButtons(user, linkUserInfo(message, users)),
    };
  }
  return message;
}

export function linkMessagesData(
  user: User | null,
  users: User[] | null,
  messages: Message[] | null
) {
  const fullMessages: Message[] = [];
  messages?.forEach((m) => {
    if (users) {
      const author: User = users.filter((u) => u.id == m.author)[0];
      if (author) {
        fullMessages.push(enableButtons(user, linkUserInfo(m, users)));
      }
    }
  });
  return fullMessages.sort((a, b) => b.tmstp - a.tmstp);
}

export function enableButtons(user: User | null, message: Message): Message {
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

export function linkUserInfo(message: Message, users: User[]): Message {
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

export function popMessage(messages: Message[], message: Message) {
  return messages.filter((m) => !(m.uuid == message.uuid));
}

export function popTwat(messages: Message[], message: Message, user: User) {
  return messages.filter(
    (m) =>
      !(
        m.uuid == message.uuid &&
        m.tmstp != message.tmstp &&
        user.id == m.retwatAuthor
      )
  );
}

export function replaceMessage(messages: Message[] | null, message: Message) {
  if (messages == null) return [];

  const newMessages = messages.filter(
    (m) => !(m.uuid == message.uuid && m.tmstp == message.tmstp)
  );
  newMessages.push(message);
  return newMessages;
}

export function addNewMessage(
  messages: Message[],
  author: User,
  text: string
): Message[] {
  console.log(messages);
  const newMsgArr = messages.slice();
  newMsgArr.push(createNewMessage(author, text));
  return newMsgArr;
}

export function addNewRetwat(
  messages: Message[],
  message: Message,
  user: User
) {
  const newMsgArr = messages.slice();
  newMsgArr.push(createRetwat(user, message));
  return newMsgArr;
}

export function markUntwatted(
  messages: Message[],
  message: Message,
  user: User
) {
  if (message.retwattedBy) {
    return replaceMessage(messages, {
      ...message,
      retwattedBy: message.retwattedBy.filter((rt) => rt != user.id),
    });
  } else {
    return messages;
  }
}

export function markRetwatted(
  messages: Message[],
  message: Message,
  user: User
) {
  if (message.retwattedBy) {
    const retwatArr = message.retwattedBy.slice();
    retwatArr.push(user.id);
    return replaceMessage(messages, {
      ...message,
      retwattedBy: retwatArr,
    });
  } else {
    return messages;
  }
}

export function addNewComment(
  messages: Message[] | null,
  message: Message,
  author: User,
  text: string
): Message[] {
  if (messages == null) return [];

  const comment = createNewMessage(author, text, message.uuid);
  const updatedMessage = {
    ...message,
    comments: message.comments.slice(),
  };
  updatedMessage.comments.push(comment.uuid);

  let updatedMessages = replaceMessage(messages, updatedMessage);
  updatedMessages.push(comment);
  return updatedMessages;
}

export function getCurrentMessage(messages: Message[], uuid: string) {
  return messages.find((m) => m.uuid == uuid);
}

function createNewMessage(
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
    retwattedBy: [],
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

function createRetwat(user: User, message: Message): Message {
  return {
    uuid: message.uuid,
    author: message.author,
    retwatAuthor: user.id,
    tmstp: Date.now(),
    text: message.text,

    parent: message.parent,
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

export function addLikeToMessageFn(
  messages: Message[] | null,
  message: Message,
  user: User
) {
  console.log('Adding to message');
  const newMessage: Message = {
    ...message,
    likedBy: message.likedBy.slice(),
  };
  newMessage.likedBy.push(user.id);
  return messages != null ? replaceMessage(messages, newMessage) : [];
}
