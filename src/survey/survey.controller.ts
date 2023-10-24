import { Controller, Post, Body, Res, Get, Param } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyDto } from './survey.dto';
import { AuthUser } from 'src/users/middleware/auth.decorator';

@Controller('surveys')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  async createSurvey(@Body() SurveyDto: SurveyDto, @Res() res,) {
    const createdSurvey = await this.surveyService.createSurvey(SurveyDto);
    return res.status(201).json(createdSurvey);
  }

  @Post('user/:id')
  async createUserSurveyResponse(@Body() SurveyDto, @Res() res,  @AuthUser('id') id: string, @Param('id') slug: string,) {
    const createdSurvey = await this.surveyService.createUserSurveyResponse(SurveyDto, id, slug);
    return res.status(201).json(createdSurvey);
  }
  
  @Get()
  async getAllSurveys() {
    return await this.surveyService.getAllSurveys();
  }

  @Get(':id')
  async getSingleSurvey(@Param('id') id: string,  @Res() res) {
    const survey = await this.surveyService.getSurveyById(id);
    return res.status(200).json(survey);
  }
}
