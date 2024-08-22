import { Permission } from '../../model/enum/permission';

export interface User {
  id: number;
  pic: string;
  username: string;
  password: string;
  permission: Permission;
  likedMessages: string[];
  retwats: string[];
  deleted?: boolean;
}
