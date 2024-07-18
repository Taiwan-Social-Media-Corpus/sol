import { NestFactory } from '@nestjs/core';
import { CorpusModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(CorpusModule);
  await app.listen(3000);
}
bootstrap();
