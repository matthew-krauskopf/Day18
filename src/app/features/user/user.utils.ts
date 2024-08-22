import { User } from './user.entity';

export function attachPhoto(user: User): User {
  return {
    ...user,
    pic: 'assets/profile-pics/{}.jpg'.replace('{}', String(user.id)),
  };
}

export function addLikeToUserFn(user: User, uuid: string): User {
  return {
    ...user,
    likedMessages: [...user.likedMessages, uuid],
  };
}

export function removeLikeFromUserFn(user: User, uuid: string): User {
  return {
    ...user,
    likedMessages: user.likedMessages.filter((m) => m != uuid),
  };
}

export function addRetwatToUser(user: User, uuid: string): User {
  return {
    ...user,
    retwats: [...user.retwats, uuid],
  };
}

export function removeRetwatFromUser(user: User, uuid: string): User {
  return {
    ...user,
    retwats: user.retwats.filter((rt) => rt != uuid),
  };
}

export function markUserDeleted(users: User[], authUserId: number) {
  const authUser = users.find((u) => u.id == authUserId);

  if (!authUser) return users;

  return [
    ...users.filter((u) => u.id != authUserId),
    {
      ...authUser,
      deleted: true,
    },
  ];
}
