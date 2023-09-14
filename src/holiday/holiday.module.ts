import { Module } from '@nestjs/common';
import { HolidayService } from './holiday.service';
import { HolidayController } from './holiday.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { HolidaySchema } from './schema/holiday.schema';
import { AdminSchema } from 'src/admin/schema/admin.schema';

@Module({
  
  providers: [HolidayService],
  controllers: [HolidayController],
  imports:[MongooseModule.forFeature([
    {name:'Holiday',schema:HolidaySchema},
    {name:"Admin",schema:AdminSchema}
  ])]
  
})
export class HolidayModule {}
