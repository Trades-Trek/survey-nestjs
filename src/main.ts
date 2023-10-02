/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ENV } from 'config/environment';
import { AppModule } from './app.module';

const express = require('express');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://nats-survey.vercel.app',
      'https://nats-survey.vercel.app/',
    ],
    methods: 'GET, HEAD, PUT, POST, DELETE, OPTIONS, PATCH',
    credentials: true,
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authentication, Access-control-allow-credentials, Access-control-allow-headers, Access-control-allow-methods, Access-control-allow-origin, User-Agent, Referer, Accept-Encoding, Accept-Language, Access-Control-Request-Headers, Cache-Control, Pragma',
  });
  app.use('/uploads', express.static('uploads'));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(ENV.PORT);
  
}
bootstrap();

