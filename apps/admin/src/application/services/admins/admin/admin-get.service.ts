import {
  Injectable,
  HttpException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { AdminAggregate } from '@sol/admin/domain/models/aggregate-root/admin';
import { AdminRepository } from '@sol/admin/infrastructure/repositories';
import { ApplicationService } from '@sol/domain/service';
import { Result, Ok, Err } from '@sol/result';

export type GetAdminInput = {
  id?: string;
  email?: string;
};

export type GetAdminOutput = Promise<Ok<AdminAggregate> | Err<HttpException>>;

@Injectable()
class GetAdminService
  implements ApplicationService<GetAdminInput, GetAdminOutput>
{
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}
  async execute(input: GetAdminInput) {
    try {
      const adminEntity = await this.adminRepository.findOne(input);
      if (!adminEntity) {
        return Result.Err(new NotFoundException('Admin not found'));
      }
      return Result.Ok(this.eventPublisher.mergeObjectContext(adminEntity));
    } catch (error) {
      return Result.Err(new InternalServerErrorException());
    }
  }
}

export default GetAdminService;
