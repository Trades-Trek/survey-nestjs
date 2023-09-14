import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
} from '@nestjs/common';
import { LearningService } from './learning.service';
import { CreateLearningDto } from './dto/create-learning.dto';
import { UpdateLearningDto } from './dto/update-learning.dto';
import { AuthAdmin } from 'src/admin/middleware/auth.decorator';
import { Put, Query, Req, UseInterceptors } from '@nestjs/common/decorators';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/helpers/ImageUpload';
import { AuthUser } from 'src/users/middleware/auth.decorator';

@Controller('learning')
export class LearningController {
  constructor(private readonly learningService: LearningService) {}
  @Post('category-create')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/userUploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async addCategory(
    @UploadedFile() file: Express.Multer.File,
    @AuthAdmin() id: string,
    @Req() req: Request,
  ) {
    Object.keys(req);
    if (req['nitesh']) {
      return {
        success: false,
        message: 'Only images are allowed',
      };
    }

    return await this.learningService.addCategory(file, id, req);
  }

  @Post('category-edit')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/userUploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async editCategory(
    @UploadedFile() file: Express.Multer.File,
    @AuthAdmin() id: string,
    @Req() req: Request,
    @Query('categoryId') categoryId:string
  ) {
    Object.keys(req);
    if (req['nitesh']) {
      return {
        success: false,
        message: 'Only images are allowed',
      };
    }

    return await this.learningService.editCategory(file, id, req,categoryId);
  }

  @Get('all-category')
  async AllCategory(@AuthAdmin('id') id:string){
    return await this.learningService.AllCategory(id)
  }

  @Post('get-all-category')
  async GetAllCategory(@AuthAdmin('id') id:string){
    return await this.learningService.getAllCategory(id)
  }

  @Delete('delete-category')
  async DeleteCategory(@AuthAdmin('id') id:string ,@Query("categoryId") categoryId:string){
    return await this.learningService.deleteCategory(id,categoryId)

  }
  @Put('enable-disable-category')
  async EnableDisableCategory(@AuthAdmin('id') id:string ,@Query("categoryId") categoryId:string){
    return await this.learningService.EnableDisableCategory(id,categoryId)

  }


  @Post('add-learning')
  async AddLearning(@AuthAdmin('id') id:string,@Body() body){
    return await this.learningService.AddLearning(id,body)

  } 

  @Post('edit-learning')
  async EditLearning(@AuthAdmin('id') id:string,@Body() body,@Query('learningId') learningId:string){
    return await this.learningService.EditLearning(id,body,learningId)

  } 
  
  @Post('all-learning')
  async AllLearning(@AuthAdmin('id') id:string,@Body() body){
    return await this.learningService.AllLearning(id,body)

  } 
  
  @Delete('delete-learning')
  async DeleteLearning(@AuthAdmin('id') id:string ,@Query("learningId") learningId:string){
    return await this.learningService.deleteLearning(id,learningId)

  }


  @Get('all-learning-info')
  async GetAllLearningInfo(@AuthUser('id') id:string){
    return await this.learningService.getAllLearningInfo(id)
  }

}
