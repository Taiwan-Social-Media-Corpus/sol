import { Redis } from 'ioredis';
import { Module } from '@nestjs/common';
import { env } from '@sol/env';
import { RedisClient } from './models';
import { SlidingWindowRateLimitService } from './services';

@Module({
  providers: [
    {
      provide: RedisClient,
      useFactory: async () => {
        const redis = new Redis({
          host: env.redisHost,
          port: Number(env.redisPort),
          password: env.redisPassword,
        });
        if (redis.status === 'end') {
          await redis.connect();
        }
        return redis;
      },
    },
    SlidingWindowRateLimitService,
  ],
  exports: [RedisClient, SlidingWindowRateLimitService],
})
export class RedisModule {}
