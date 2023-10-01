import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyController } from './survey.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SurveySchema } from './schema/survey.schema'
import { SurveyResponseSchema } from 'src/users/schema/userResponse.schema'
import { SurveyBalanceSchema } from 'src/users/schema/userSurveyBalance.schema'
import { UserSchema } from 'src/users/schema/user.schema'
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Survey", schema: SurveySchema },
      { name: "SurveyResponse", schema: SurveyResponseSchema },
      { name: "SurveyBalance", schema:  SurveyBalanceSchema},
      { name: "User", schema:  UserSchema }
    ])],
  controllers: [SurveyController],
  providers: [SurveyService]
})
export class SurveyModule { }
