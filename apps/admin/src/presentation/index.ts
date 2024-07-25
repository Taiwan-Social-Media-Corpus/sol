import AdminController from './admins/admin/admin.controller';
import AdminCsrfController from './admins/csrf/csrf.controller';
import AdminRefreshController from './admins/refresh/refresh.controller';
import AdminSessionsController from './admins/sessions/sessions.controller';

const controllers = [
  AdminController,
  AdminCsrfController,
  AdminRefreshController,
  AdminSessionsController,
];

export {
  controllers,
  AdminController,
  AdminCsrfController,
  AdminRefreshController,
  AdminSessionsController,
};
