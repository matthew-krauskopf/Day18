import { User } from '../user/user.entity';

export function performLogin(user: User, password: string) {
  return !user.deleted && user.password == password;
}

export function attachPhoto(user: User): User {
  return {
    ...user,
    pic: 'assets/profile-pics/{}.jpg'.replace('{}', String(user.id)),
  };
}
