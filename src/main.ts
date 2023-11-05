/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ENV } from 'config/environment';
import { AppModule } from './app.module';

const whitelist =    [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://nats-survey.vercel.app',
      'https://nats-survey.vercel.app/',
    ]
const express = require('express');
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      origin: function (origin, callback) {
        if (!origin) {
          callback(null, true);
          return;
        }
        if (
          whitelist.includes(origin) || // Checks your whitelist
          !!origin.match(/yourdomain\.com$/) // Overall check for your domain
        ) {
          console.log('allowed cors for:', origin);
          callback(null, true);
        } else {
          console.log('blocked cors for:', origin);
          callback(new Error('Not allowed by CORS'));
        }
      },
    },
  })


  app.use('/uploads', express.static('uploads'));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(ENV.PORT);
  
}
bootstrap();


