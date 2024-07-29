import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { CookiesMiddleware, CsrfMiddleware, CookiesModule } from '@sol/cookies';
import env from '@sol/env';
import { JwtModule } from '@sol/jwt';
import { OauthModule } from '@sol/oauth';
import { PostgresModule } from '@sol/postgres';
import { RedisModule } from '@sol/redis';
import { userServices } from '../application/services/users';
import { cqrsHandlers } from '../application/use-cases';
import { eventHandlers } from './events';
import { controllers } from '../presentation';
import { repositories } from './repositories';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [env],
      cache: true,
    }),
    PostgresModule,
    CqrsModule,
    JwtModule,
    CookiesModule,
    OauthModule,
    RedisModule,
  ],
  controllers,
  providers: [
    ...userServices,
    ...repositories,
    ...eventHandlers,
    ...cqrsHandlers,
  ],
})
export class CorpusModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CookiesMiddleware)
      .forRoutes('*')
      .apply(CsrfMiddleware)
      .exclude('user/_ping')
      .forRoutes(...controllers);
  }
}
