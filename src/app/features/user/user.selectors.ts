import { UserState } from './user.state';

export const selectUsers = (state: UserState) => state.users;
