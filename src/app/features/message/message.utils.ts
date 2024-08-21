import { User } from '../user/user.entity';
import { Message } from './message.entity';

export function linkMessageData(
  user: User | null,
  users: User[],
  message: Message | null
): Message | null {
  if (message != null) {
    return {
      ...enableButtons(user, linkUserInfo(message, users)),
    };
  }
  return message;
}

export function linkMessagesData(
  user: User | null,
  users: User[],
  messages: Message[]
) {
  const fullMessages: Message[] = [];
  messages.forEach((m) => {
    const author: User = users.filter((u) => u.id == m.author)[0];
    if (author) {
      fullMessages.push(enableButtons(user, linkUserInfo(m, users)));
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
    username: user ? user.username : '',
    retwatUsername:
      users.find((u) => message.retwatAuthor == u.id)?.username ?? undefined,
    pic: user ? user.pic : '',
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
  const updatedMessage: Message = {
    ...message,
    comments: [...message.comments, comment.uuid],
  };

  return [...replaceMessage(messages, updatedMessage), comment];
}

export function getCurrentMessage(messages: Message[], uuid: string) {
  return messages.find((m) => m.uuid == uuid);
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
    retwattedBy: [],
    deletable: false,
    editable: false,
    username: '',
    retwatUsername: undefined,
    pic: '',
  };
}

export function addLikeToMessageFn(
  messages: Message[],
  message: Message,
  user: User
) {
  const newMessage: Message = {
    ...message,
    likedBy: [...message.likedBy, user.id],
  };
  return replaceMessage(messages, newMessage);
}

export function removeLikeFromMessageFn(
  messages: Message[],
  message: Message,
  user: User
) {
  const newMessage: Message = {
    ...message,
    likedBy: message.likedBy.filter((m) => m != user.id),
  };
  return replaceMessage(messages, newMessage);
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
    newMessages.push(createRetwat(user, message));
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
    return popTwat(newMessages, message, user);
  } else {
    return messages;
  }
}
