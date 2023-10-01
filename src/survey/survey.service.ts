import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Survey } from './schema/survey.schema';
import { SurveyDto } from './survey.dto';
import { SurveyResponse } from 'src/users/schema/userResponse.schema';
import { SurveyBalance } from 'src/users/schema/userSurveyBalance.schema';
import { User } from 'src/users/schema/user.schema';
@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
    @InjectModel('SurveyResponse')
    private readonly surveyResponseModel: Model<SurveyResponse>,
    @InjectModel('SurveyBalance')
    private readonly SurveyBalanceModel: Model<SurveyBalance>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async getAllSurveys() {
    const data = await this.surveyModel.find();
    return {
      success: true,
      message: `Survey retrieved`,
      data,
    };
  }

  async getSurveyById(id) {
    const data = await this.surveyModel.find({ slug: id });
    return {
      success: true,
      message: `All Surveys`,
      data,
    };
  }

  async createSurvey(survey: SurveyDto) {
    const data = await this.surveyModel.create(survey);

    return {
      success: true,
      message: `Survey created`,
      data,
    };
  }

  async createUserSurveyResponse(userResponse, id: string, slug: string) {
    const c = {
      answers: userResponse,
      userId: id,
      slug,
    };

    const user = await this.userModel.findById(id);
    if (!user) {
      return {
        success: false,
        message: 'User not found!.',
      };
    }
    const userSubCategory = user.subscriptionCategory;
    const survey = await this.surveyModel.find({ slug });
    const surveyObject = survey[0];

    const doesRecordExist = await this.surveyResponseModel.find({
      surveyId: surveyObject._id,
      userId: user._id,
    });

    if (doesRecordExist && doesRecordExist.length) {
      return {
        success: false,
        message: 'User has already anwsered survey',
      };
    }

    let surveyPricePerQuestion = 0;
    const { normalPrice, basicPrice, standardPrice, premiumPrice } =
      surveyObject;

    if (userSubCategory === 'free') {
      surveyPricePerQuestion = normalPrice;
    }

    if (userSubCategory === 'Premium') {
      surveyPricePerQuestion = premiumPrice;
    }

    if (userSubCategory === 'Standard') {
      surveyPricePerQuestion = standardPrice;
    }

    if (userSubCategory === 'Basic') {
      surveyPricePerQuestion = basicPrice;
    }

    const surveyBalance =
    surveyPricePerQuestion * surveyObject.questions.length;

    const newlySavedUserResponse = await this.surveyResponseModel.create({
      surveyId: surveyObject._id,
      userId: user._id,
      answers: userResponse
    });

    if (newlySavedUserResponse) {
      const newlySavedUserSurveyBalance = await this.SurveyBalanceModel.create({
        surveyId: surveyObject._id,
        userId: user._id,
        balance: surveyBalance
      });
    }

    return {
      success: true,
      message: `User survey response saved`,
      surveyBalance,
    };
  }
}
