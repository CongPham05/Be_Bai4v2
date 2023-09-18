import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //add middleware HERE
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  //app.enableCors({ origin: 'http://localhost:5173', credentials: true })
  app.enableCors({ origin: true, credentials: true })
  await app.listen(3000);
}
bootstrap();
