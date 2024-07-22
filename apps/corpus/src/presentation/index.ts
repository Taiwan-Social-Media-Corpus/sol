import UserAuthController from './users/auth/auth.controller';
import UserCsrfController from './users/csrf/csrf.controller';
import UserRefreshController from './users/refresh/refresh.controller';
import UserSessionsController from './users/sessions/session.controller';

const controllers = [
  UserAuthController,
  UserCsrfController,
  UserRefreshController,
  UserSessionsController,
];

export { controllers, UserAuthController };
