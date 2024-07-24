import { CreateAdminCommandHandler } from './admin/commands/create/handler';
import { AdminLoginQueryHandler } from './admin/queries/login/handler';
import { CheckAdminRefreshTokenQueryHandler } from './admin/queries/refreshToken/handler';

const cqrsHandlers = [
  CreateAdminCommandHandler,
  AdminLoginQueryHandler,
  CheckAdminRefreshTokenQueryHandler,
] as const;

export { cqrsHandlers };
