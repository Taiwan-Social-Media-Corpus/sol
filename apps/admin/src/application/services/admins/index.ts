import CreateAdminService from './admin/admin-creation.service';
import GetAdminService from './admin/admin-get.service';
import LoginRateLimitService from './sessions/ratelimit.service';

const adminServices = [
  CreateAdminService,
  GetAdminService,
  LoginRateLimitService,
] as const;

export {
  CreateAdminService,
  GetAdminService,
  LoginRateLimitService,
  adminServices,
};
