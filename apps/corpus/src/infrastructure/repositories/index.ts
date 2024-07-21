import UserRepository from './user.repository';

const repositories = [UserRepository] as const;

export { UserRepository, repositories };
