import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { env } from '@sol/libs/env';

export const typeOrmModuleOptions: TypeOrmModuleOptions =
  env.nodeEnv !== 'test'
    ? {
        type: 'postgres',
        host: env.pgHost,
        port: env.pgPort,
        username: env.pgUser,
        password: env.pgPassword,
        database: env.pgDB,
        synchronize: false,
        logging: false,
      }
    : {
        type: 'better-sqlite3',
        name: 'default',
        database: ':memory:',
        synchronize: true,
        keepConnectionAlive: true,
      };
