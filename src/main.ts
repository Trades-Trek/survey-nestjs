/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ENV } from 'config/environment';
import { AppModule } from './app.module';

const express = require('express');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const whiteList = [
    'http://localhost:3000',
    'http://localhost:3001',
  ];
  app.enableCors({
    origin: function (origin, callback) {
      if (whiteList.indexOf(origin) >= 0 || !origin) {
        if (origin != '') {
          callback(null, true);
        }
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.use('/uploads', express.static('uploads'));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(ENV.PORT);
  
}
bootstrap();

