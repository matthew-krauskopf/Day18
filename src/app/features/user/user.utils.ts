import { Injectable } from '@angular/core';
import { User } from './user.entity';

@Injectable({
  providedIn: 'root',
})
export class UserUtils {
  attachPhoto(user: User): User {
    return {
      ...user,
      pic: 'assets/profile-pics/{}.jpg'.replace('{}', String(user.id)),
    };
  }
}

export function attachPhoto(user: User): User {
  return {
    ...user,
    pic: 'assets/profile-pics/{}.jpg'.replace('{}', String(user.id)),
  };
}

export function addLikeToUserFn(user: User | null, uuid: string): User | null {
  if (user == null) return null;

  const newUser = {
    ...user,
    likedMessages: user.likedMessages.slice(),
  };
  newUser.likedMessages.push(uuid);
  return newUser;
}

export function removeLikeFromUserFn(
  user: User | null,
  uuid: string
): User | null {
  if (user == null) return null;

  const newUser = {
    ...user,
    likedMessages: user.likedMessages.filter((m) => m != uuid),
  };
  return newUser;
}

export function addRetwatToUser(user: User | null, uuid: string): User | null {
  if (user == null) return user;

  const newUser = {
    ...user,
    retwats: user.retwats.slice(),
  };
  newUser.retwats.push(uuid);
  return newUser;
}

export function removeRetwatFromUser(
  user: User | null,
  uuid: string
): User | null {
  if (user == null) return user;

  const newUser = {
    ...user,
    retwats: user.retwats.filter((rt) => rt != uuid),
  };
  return newUser;
}
