/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist/common';
import { Admin } from './admin/schema/admin.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
 
const stripe = require('stripe')(
  'sk_test_51NGdH3D042ZsvsAiPZWvsRwNG1A71L03wtERzCJVvw443Hdkpq36wKHmrN9RzPlNIvmqyQ05lFXz7I4XuuGGNVVU00stTR5Law',
);
@Injectable()
export class AppService implements OnModuleInit {
  constructor(@InjectModel('Admin') private adminModel: Model<Admin>) {}
  async onModuleInit() {
    const admin = await this.adminModel.find().exec();

    const password = await bcrypt.hash('surveyking', 10);

    if (admin.length == 0) {
      const myadmin = await new this.adminModel({
        email: 'admin@natsurveys.com',
        username: 'admin',
        password,
      }).save();
    }
  }
  getHello(): string {
    return 'Nat survey is alive and well(vercel)';
  }

  async paymentIntent(body) {
    try {
      const { plan } = body;

      let amount = 100 * 500;
      if (plan === 'basic') {
        amount = 100 * 500;
      }

      if (plan === 'standard') {
        amount = 100 * 1000;
      }

      if (plan === 'premium') {
        amount = 100 * 2000;
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        payment_method_types: ['card'],
      });

      return {
        success: true,
        message: 'Payment intent  created successfully.',
        clientSecret: paymentIntent.client_secret,
        paymentIntent,
      };
    } catch (err) {
      return {
        success: false,
        message: 'Payment intent failed.',
        error: { message: err.message },
      };
    }
  }
}
