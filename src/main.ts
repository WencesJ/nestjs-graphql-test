import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configEnv } from './utils/config';
import { logger } from './utils/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(configEnv.PORT);

  const url = `${configEnv.BASE_URL}:${configEnv.PORT}`;
  logger.debug(`Application is running on: ${url}`);

  logger.debug(`GraphQL Playground: ${url}:/graphql`);
}

bootstrap();
