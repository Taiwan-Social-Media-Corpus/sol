import { UnauthorizedException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAdminService } from '@sol/admin/application/services/admins';
import { CheckAdminRefreshTokenQuery } from './query';

@QueryHandler(CheckAdminRefreshTokenQuery)
export class CheckAdminRefreshTokenQueryHandler
  implements IQueryHandler<CheckAdminRefreshTokenQuery>
{
  constructor(private readonly getAdminService: GetAdminService) {}

  async execute(query: CheckAdminRefreshTokenQuery) {
    const adminResult = await this.getAdminService.execute({
      id: query.id,
    });
    if (adminResult.isErr()) {
      throw new UnauthorizedException();
    }

    const adminEntity = adminResult.getValue();
    if (adminEntity.refreshToken !== query.refreshToken) {
      throw new UnauthorizedException();
    }
    return adminEntity;
  }
}
