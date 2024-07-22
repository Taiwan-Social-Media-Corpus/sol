import {
  Injectable,
  HttpException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserAggregate } from '@sol/corpus/domain/models/aggregate-root';
import { UserRepository } from '@sol/corpus/infrastructure/repositories';
import { ApplicationService } from '@sol/domain/service';
import { Result, Ok, Err } from '@sol/result';

type GetUserInput = {
  id?: string;
  email?: string;
};

type GetUserOutput = Promise<Ok<UserAggregate> | Err<HttpException>>;

@Injectable()
class GetUserService
  implements ApplicationService<GetUserInput, GetUserOutput>
{
  constructor(private readonly userRepository: UserRepository) {}
  async execute(input: GetUserInput) {
    try {
      const userEntity = await this.userRepository.findOne(input);
      if (!userEntity) {
        return Result.Err(new NotFoundException('User not found'));
      }
      return Result.Ok(userEntity);
    } catch (error) {
      return Result.Err(new InternalServerErrorException());
    }
  }
}

export default GetUserService;
