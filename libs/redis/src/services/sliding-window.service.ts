import { Injectable } from '@nestjs/common';
import { RedisClient } from '../models';

@Injectable()
class SlidingWindowRateLimitService {
  private ttl!: number;
  private subintervalSeconds!: number;

  constructor(private readonly redis: RedisClient) {}

  configure(ttl: number, subintervalSeconds: number) {
    this.ttl = ttl;
    this.subintervalSeconds = subintervalSeconds;
  }

  private getBucketStartTime(timestamp: number = Date.now()) {
    return (
      Math.floor(timestamp / 1000 / this.subintervalSeconds) *
      this.subintervalSeconds
    );
  }

  async increment(key: string, value: number) {
    const bucket = this.getBucketStartTime();
    return await this.redis
      .multi()
      .hincrby(key, bucket.toString(), value)
      .expire(key, this.ttl)
      .exec();
  }

  async getCount(key: string, checkExpired: boolean = false) {
    const baseTime = this.getBucketStartTime();
    const expiredBuckets: string[] = [];
    const buckets = await this.redis.hkeys(key);

    for (const bucket of buckets) {
      if (baseTime - parseInt(bucket) > this.ttl) {
        expiredBuckets.push(bucket);
      }
    }

    if (checkExpired && expiredBuckets.length > 0) {
      await this.redis.hdel(key, ...expiredBuckets);
    }

    const counts = await this.redis.hvals(key);
    return counts.reduce((total, count) => total + parseInt(count), 0);
  }
}

export default SlidingWindowRateLimitService;
