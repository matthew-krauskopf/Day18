import { User } from './user.entity';

export interface UserState {
  user: User | null;
  users: User[] | null;
}
