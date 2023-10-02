/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist/common';
import { Admin } from './admin/schema/admin.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectModel('Admin') private adminModel: Model<Admin>,
 ) { }
  async onModuleInit() {
    const admin = await this.adminModel.find().exec();

    const password = await bcrypt.hash('P@ssword1', 10);
   
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
}
