import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { CreateAdminService } from '@sol/admin/application/services/admins';
import { env } from '@sol/env';
import { JwtService } from '@sol/jwt';
import { CreateAdminCommand } from './command';

@CommandHandler(CreateAdminCommand)
export class CreateAdminCommandHandler
  implements ICommandHandler<CreateAdminCommand>
{
  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly jwtService: JwtService,
    private readonly createAdminService: CreateAdminService,
  ) {}

  async execute(command: CreateAdminCommand) {
    const { token, ...adminDto } = command;
    if (env.adminToken !== token) {
      throw new UnauthorizedException('Invalid token');
    }

    const refreshToken = this.jwtService.generateRefreshToken();
    const adminResult = await this.createAdminService.execute({
      ...adminDto,
      refreshToken,
    });
    if (adminResult.isErr()) {
      throw adminResult.getError();
    }
    return this.eventPublisher.mergeObjectContext(adminResult.getValue());
  }
}
