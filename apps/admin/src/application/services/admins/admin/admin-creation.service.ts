import {
  Injectable,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { createId } from '@paralleldrive/cuid2';
import {
  AdminRoleVO,
  AdminEmailVO,
  AdminPasswordVO,
} from '@sol/admin/domain/models/value-object';
import { AdminAggregate } from '@sol/admin/domain/models/aggregate-root';
import AdminMapper from '@sol/admin/infrastructure/mappers/admin';
import { AdminRepository } from '@sol/admin/infrastructure/repositories';
import { ApplicationService } from '@sol/domain/service';
import { Result, Ok, Err } from '@sol/result';

export type CreateAdminInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
  refreshToken: string;
};

export type CreateAdminOutput = Promise<
  Ok<AdminAggregate> | Err<HttpException>
>;

@Injectable()
class CreateAdminService
  implements ApplicationService<CreateAdminInput, CreateAdminOutput>
{
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}
  async execute(input: CreateAdminInput) {
    const cuid = createId();
    const password = await AdminPasswordVO.createHash({
      value: input.password,
    });
    const adminEntity = AdminAggregate.create(cuid, {
      firstName: input.firstName,
      lastName: input.lastName,
      email: AdminEmailVO.create({ value: input.email }),
      password,
      role: AdminRoleVO.create({ value: input.roleId }),
      refreshToken: input.refreshToken,
      disabled: false,
    });

    const adminDao = AdminMapper.toPersistence(adminEntity);
    try {
      const admin = await this.adminRepository.save(adminDao);
      return Result.Ok(this.eventPublisher.mergeObjectContext(admin));
    } catch (error) {
      return Result.Err(new InternalServerErrorException());
    }
  }
}

export default CreateAdminService;
