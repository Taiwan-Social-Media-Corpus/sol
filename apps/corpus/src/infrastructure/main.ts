import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { env } from '@sol/env';
import { HttpExceptionFilter } from '@sol/errors/filters';
import { CorpusModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(CorpusModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api/v1');
  app.use(cookieParser(env.cookieSecret));
  app.use(helmet());
  await app.listen(3000);
}

bootstrap();
