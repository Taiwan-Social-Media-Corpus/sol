import { Request } from 'express';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import Definition from '@sol/definition';
import { TooManyRequestsException } from '@sol/errors/exceptions';
import { SlidingWindowRateLimitService } from '@sol/redis';

@Injectable()
class ConcordanceGuard implements CanActivate {
  constructor(
    private readonly ratelimitService: SlidingWindowRateLimitService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    if (request.ip === undefined) {
      throw new BadRequestException('Unable to determine client IP address');
    }

    const redisKey = `rate-limit:concordance:${request.ip.replace('::ffff:', '')}`;
    this.ratelimitService.configure(10 * 60, 10);
    const count = await this.ratelimitService.getCount(redisKey);
    if (count > Definition.RateLimit.Concordance - 1) {
      throw new TooManyRequestsException();
    }
    await this.ratelimitService.increment(redisKey, 1);
    return true;
  }
}

export default ConcordanceGuard;
