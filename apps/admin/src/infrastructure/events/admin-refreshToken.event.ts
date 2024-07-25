import { InternalServerErrorException } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateAdminRefreshTokenEvent } from '@sol/admin/domain/events';
import { AdminRepository } from '@sol/postgres';

@EventsHandler(UpdateAdminRefreshTokenEvent)
class UpdateAdminRefreshTokenEventHandler
  implements IEventHandler<UpdateAdminRefreshTokenEvent>
{
  constructor(private readonly adminRepository: AdminRepository) {}

  handle(event: UpdateAdminRefreshTokenEvent) {
    try {
      this.adminRepository.update(
        { id: event.id },
        { refreshToken: event.refreshToken },
      );
    } catch {
      throw new InternalServerErrorException();
    }
  }
}

export default UpdateAdminRefreshTokenEventHandler;
