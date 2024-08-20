import { User } from './user.entity';

export function attachPhoto(user: User): User {
  return {
    ...user,
    pic: 'assets/profile-pics/{}.jpg'.replace('{}', String(user.id)),
  };
}

export function addLikeToUserFn(user: User | null, uuid: string): User | null {
  if (user == null) return null;

  return {
    ...user,
    likedMessages: [...user.likedMessages, uuid],
  };
}

export function removeLikeFromUserFn(
  user: User | null,
  uuid: string
): User | null {
  if (user == null) return null;

  return {
    ...user,
    likedMessages: user.likedMessages.filter((m) => m != uuid),
  };
}

export function addRetwatToUser(user: User | null, uuid: string): User | null {
  if (user == null) return user;

  return {
    ...user,
    retwats: [...user.retwats, uuid],
  };
}

export function removeRetwatFromUser(
  user: User | null,
  uuid: string
): User | null {
  if (user == null) return user;

  return {
    ...user,
    retwats: user.retwats.filter((rt) => rt != uuid),
  };
}
