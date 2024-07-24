import {
  Injectable,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import Definition from '@sol/definition';
import { ApplicationService } from '@sol/domain/service';
import { TooManyRequestsException } from '@sol/errors/exceptions';
import { getAdminRedisKey, SlidingWindowRateLimitService } from '@sol/redis';
import { Result, Ok, Err } from '@sol/result';

export type LoginRateLimitInput = { email: string };
export type LoginRateLimitOutput = Promise<Ok<null> | Err<HttpException>>;

@Injectable()
class LoginRateLimitService
  implements ApplicationService<LoginRateLimitInput, LoginRateLimitOutput>
{
  constructor(
    private readonly ratelimitService: SlidingWindowRateLimitService,
  ) {}
  async execute(input: LoginRateLimitInput) {
    const redisKey = getAdminRedisKey({
      kind: 'emailRate',
      email: input.email,
    });

    try {
      this.ratelimitService.configure(10 * 60, 10);
      const count = await this.ratelimitService.getCount(redisKey);
      if (count > Definition.RateLimit.AdminLogin - 1) {
        return Result.Err(new TooManyRequestsException());
      }

      await this.ratelimitService.increment(redisKey, 1);
      return Result.Ok(null);
    } catch (error) {
      return Result.Err(new InternalServerErrorException());
    }
  }
}

export default LoginRateLimitService;
