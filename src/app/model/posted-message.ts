import { User } from '../features/user/user.entity';

export interface PostedMessage {
  user: User;
  text: string;
}
