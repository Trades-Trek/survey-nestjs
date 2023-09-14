import { Module } from '@nestjs/common';
import { LearningService } from './learning.service';
import { LearningController } from './learning.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './schema/category.schema';
import { AdminSchema } from 'src/admin/schema/admin.schema';
import { LearningSchema } from './schema/learning.schema';
import { UserSchema } from 'src/users/schema/user.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: 'Category', schema: CategorySchema },
      { name: 'Admin', schema: AdminSchema},
      { name: 'Learning', schema: LearningSchema},
      { name: 'User', schema: UserSchema},




    ])
  ],
  controllers: [LearningController],
  providers: [LearningService]
})
export class LearningModule {}
