import { User } from './user.entity';

export function attachPhoto(user: User): User {
  return {
    ...user,
    pic: 'assets/profile-pics/{}.jpg'.replace('{}', String(user.id)),
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
