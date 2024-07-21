import { CreateUserCommandHandler } from './user/commands/create/handler';
import { CheckUserRefreshTokenQueryHandler } from './user/queries/refreshToken/handler';

const cqrsHandlers = [
  CreateUserCommandHandler,
  CheckUserRefreshTokenQueryHandler,
] as const;

export { cqrsHandlers };
 