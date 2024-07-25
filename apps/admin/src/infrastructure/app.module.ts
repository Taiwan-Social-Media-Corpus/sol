import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { CookiesMiddleware, CsrfMiddleware, CookiesModule } from '@sol/cookies';
import env from '@sol/env';
import { JwtModule } from '@sol/jwt';
import { OauthModule } from '@sol/oauth';
import { PostgresModule } from '@sol/postgres';
import { RedisModule } from '@sol/redis';
import { eventHandlers } from './events';
import { repositories } from './repositories';
import { adminServices } from '../application/services/admins';
import { cqrsHandlers } from '../application/use-cases';
import { controllers } from '../presentation';

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
    RedisModule,
    CookiesModule,
    OauthModule,
  ],
  controllers,
  providers: [
    ...eventHandlers,
    ...repositories,
    ...adminServices,
    ...cqrsHandlers,
  ],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CookiesMiddleware)
      .forRoutes('*')
      .apply(CsrfMiddleware)
      .exclude(
        { path: 'admin', method: RequestMethod.POST },
        { path: 'admin/sessions', method: RequestMethod.POST },
        'admin/_ping',
      )
      .forRoutes(...controllers);
  }
}
