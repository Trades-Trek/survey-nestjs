import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Logging, } from './schema/logging.schema';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class LoggingService {
  constructor(
    @InjectModel('Logging') private loggingModel: Model<Logging>,
  ) {}

  async createLog(logData: Partial<Logging>): Promise<Logging> {
    const log = new this.loggingModel({
      ...logData,
    });
    return await log.save();
  }

  @OnEvent('logs',  { async: true })
  handleOrderCreatedEvent(logData) {
   return this.createLog(logData)
  }


  async getLogs(){
    return await this.loggingModel.find().sort({ createdAt: -1 }).exec();
  }

}

