import { Permission } from './permission';

export interface User {
  id: number;
  pic: string;
  username: string;
  password: string;
  permission: Permission;
}
