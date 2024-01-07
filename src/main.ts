import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Creat app instance
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['error', 'warn', 'log'],
  });

  // Api endpoint prefix
  app.setGlobalPrefix('api');

  // Init app
  await app.listen(3000);
}
bootstrap();
