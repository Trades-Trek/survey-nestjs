import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from 'src/admin/schema/admin.schema';
import { AdminrefferalperController } from './adminrefferalper.controller';
import { AdminrefferalperService } from './adminrefferalper.service';
import { AdminRefferalPerSchema } from './schema/adminrefferalper.schema';

@Module({
  controllers: [AdminrefferalperController],
  providers: [AdminrefferalperService],
  imports: [
    MongooseModule.forFeature([
      { name: 'AdminRefferalPer', schema: AdminRefferalPerSchema },
      {name:'Admin',schema:AdminSchema},

    ]),
  ],

})
export class AdminrefferalperModule {}
