import {
  Injectable,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { createId } from '@paralleldrive/cuid2';
import {
  UserAggregate,
  UserAggregateProps,
} from '@sol/corpus/domain/models/aggregate-root/user';
import { UserEmailVO } from '@sol/corpus/domain/models/value-object';
import { UserMapper } from '@sol/corpus/infrastructure/mappers';
import { UserRepository } from '@sol/corpus/infrastructure/repositories';
import { ApplicationService } from '@sol/domain/service';
import { Result, Ok, Err } from '@sol/result';

export type CreateUserInput = Omit<UserAggregateProps, 'disabled' | 'email'> & {
  email: string;
};
export type CreateUserOutput = Promise<Ok<UserAggregate> | Err<HttpException>>;

@Injectable()
class CreateUserService
  implements ApplicationService<CreateUserInput, CreateUserOutput>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}
  async execute(input: CreateUserInput) {
    const cuid = createId();
    const userEntity = UserAggregate.create(cuid, {
      firstName: input.firstName,
      lastName: input.lastName,
      email: UserEmailVO.create({ value: input.email }),
      picture: input.picture,
      refreshToken: input.refreshToken,
      disabled: false,
    });

    const userDao = UserMapper.toPersistence(userEntity);
    try {
      const user = await this.userRepository.save(userDao);
      return Result.Ok(this.eventPublisher.mergeObjectContext(user));
    } catch (error) {
      return Result.Err(new InternalServerErrorException());
    }
  }
}

export default CreateUserService;
