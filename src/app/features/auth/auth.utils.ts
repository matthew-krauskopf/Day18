import { User } from '../user/user.entity';

export function performLogin(user: User, password: string) {
  return !user.deleted && user.password == password;
}
