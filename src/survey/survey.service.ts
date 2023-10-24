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

    const survey = await this.surveyModel.findOne({ slug });

    if (!survey) {
      return {
        success: false,
        message: `Survey not found`,
      };
    }

    const doesRecordExist = await this.surveyResponseModel.findOne({
      surveyId: survey._id,
      userId: user._id,
    });

    if (doesRecordExist) {
      return {
        success: false,
        message: 'User has already anwsered survey',
      };
    }

    let surveyPricePerQuestion = 'normalPrice';
    if (userSubCategory === 'free') {
      surveyPricePerQuestion = 'normalPrice';
    }

    if (userSubCategory === 'Premium') {
      surveyPricePerQuestion = 'premiumPrice';
    }

    if (userSubCategory === 'Standard') {
      surveyPricePerQuestion = 'standardPrice';
    }

    if (userSubCategory === 'Basic') {
      surveyPricePerQuestion = 'basicPrice';
    }

    const surveyQuestionsPrices = survey.questions.map(
      (e) => e[surveyPricePerQuestion],
    );

    var surveyProfit = surveyQuestionsPrices.reduce(function (a, b) {return a + b;}, 0)

    const newlySavedUserResponse = await this.surveyResponseModel.create({
      surveyId: survey._id,
      userId: user._id,
      answers: userResponse
    });

    if (newlySavedUserResponse) {
      const newlySavedUserSurveyBalance = await this.SurveyBalanceModel.create({
        surveyId: survey._id,
        userId: user._id,
        balance: surveyProfit
      });
    }

    const results = await this.SurveyBalanceModel.find({ userId: user.id, withdrawn: false });
    const totalSurveyBalance = results.reduce((sum, item) => sum + item.balance, 0);


    return {
      success: true,
      message: `User survey response saved`,
      surveyBalance: surveyProfit,
      totalSurveyBalance,
    };
  }
}
