import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Logging, LoggingSchema } from './schema/logging.schema';
import { LoggingService } from './logging.service';



@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Logging.name, schema: LoggingSchema }]),
  ],
  providers: [LoggingService],
  exports: [LoggingService]
})
export class LoggingModule {}

