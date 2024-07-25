import { UnauthorizedException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAdminService } from '@sol/admin/application/services/admins';
import { AdminLoginQuery } from './query';
import { LoginRateLimitService } from '@sol/admin/application/services/admins';

@QueryHandler(AdminLoginQuery)
export class AdminLoginQueryHandler implements IQueryHandler<AdminLoginQuery> {
  constructor(
    private readonly getAdminService: GetAdminService,
    private readonly rateLimitService: LoginRateLimitService,
  ) {}

  async execute(query: AdminLoginQuery) {
    const adminResult = await this.getAdminService.execute({
      email: query.email,
    });
    if (adminResult.isErr()) {
      const ratelimitResult = await this.rateLimitService.execute({
        email: query.email,
      });
      if (ratelimitResult.isErr()) {
        throw ratelimitResult.getError();
      }

      throw new UnauthorizedException();
    }
    const adminEntity = adminResult.getValue();
    const pwdResult = await adminEntity.validatePassword(query.password);
    if (pwdResult.isErr()) {
      throw pwdResult.getError();
    }
    return adminEntity;
  }
}
