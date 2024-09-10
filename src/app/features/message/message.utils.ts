import { User } from '../user/user.entity';
import { Message } from './message.entity';

export function linkMessagesData(
  user: User | null,
  users: User[],
  messages: Message[]
) {
  return messages
    .map((m) => enableButtons(user, linkUserInfo(m, users)))
    .sort((a, b) => b.tmstp - a.tmstp);
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
    username: user ? user.username : '',
    retwatUsername:
      users.find((u) => message.retwatAuthor == u.id)?.username ?? undefined,
    pic: user ? user.pic : '',
    editable: false,
    deletable: false,
  };
}

export function replaceMessage(messages: Message[], message: Message) {
  return [
    ...messages.filter(
      (m) => !(m.uuid == message.uuid && m.tmstp == message.tmstp)
    ),
    message,
  ];
}

export function addNewComment(
  messages: Message[],
  message: Message,
  author: User,
  text: string
): Message[] {
  const comment = createNewMessage(author, text, message.uuid);
  return [
    ...replaceMessage(messages, {
      ...message,
      comments: [...message.comments, comment.uuid],
    }),
    comment,
  ];
}

export function createNewMessage(
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

export function addRetwatFn(messages: Message[], message: Message, user: User) {
  if (message.retwattedBy) {
    // Mark retwatted
    const retwatArr = message.retwattedBy.slice();
    retwatArr.push(user.id);
    let newMessages = replaceMessage(messages, {
      ...message,
      retwattedBy: retwatArr,
    });

    // Add retwat as message
    newMessages.push({
      uuid: message.uuid,
      author: message.author,
      retwatAuthor: user.id,
      tmstp: Date.now(),
      text: message.text,

      parent: message.parent,
      comments: [],
      likedBy: [],
      retwattedBy: [],
      deletable: false,
      editable: false,
      username: '',
      retwatUsername: undefined,
      pic: '',
    });
    return newMessages;
  } else {
    return messages;
  }
}

export function removeRetwatFn(
  messages: Message[],
  message: Message,
  user: User
) {
  if (message.retwattedBy) {
    // Mark untwatted
    const retwatArr = message.retwattedBy.filter((u) => u != user.id);
    let newMessages = replaceMessage(messages, {
      ...message,
      retwattedBy: retwatArr,
    });

    // Remove retwat
    return newMessages.filter(
      (m) =>
        !(
          m.uuid == message.uuid &&
          m.tmstp != message.tmstp &&
          user.id == m.retwatAuthor
        )
    );
  } else {
    return messages;
  }
}
