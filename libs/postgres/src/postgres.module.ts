import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import env from '@sol/env';
import { typeOrmModuleOptions } from './config';
import { entities } from './entities';
import { repositories } from './repositories';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [env],
      cache: true,
    }),

    TypeOrmModule.forRoot({ ...typeOrmModuleOptions, entities }),
    TypeOrmModule.forFeature(entities),
  ],
  providers: [...repositories],
  exports: [TypeOrmModule, ...repositories],
})
@Global()
export class PostgresModule {}
