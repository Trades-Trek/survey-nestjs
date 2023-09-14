import { Injectable } from '@nestjs/common';
import { ENV } from 'config/environment';
import { Request } from 'express';
import { CreateLearningDto } from './dto/create-learning.dto';
import { UpdateLearningDto } from './dto/update-learning.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schema/category.schema';
import { Admin } from 'src/admin/schema/admin.schema';
import * as PaginateModel from 'mongoose-paginate';

import mongoose, { Model } from 'mongoose';
import { Learning } from './schema/learning.schema';
import { User } from 'src/users/schema/user.schema';
@Injectable()
export class LearningService {
  constructor(
    @InjectModel('Category') private categoryModel: PaginateModel<Category>,
    @InjectModel('Admin') private adminModel: Model<Admin>,
    @InjectModel('User') private userModel: Model<User>,

    @InjectModel('Learning') private learningModel: Model<Learning>,
  ) {}
  async addCategory(file: Express.Multer.File, id: string, req: Request) {
    try {
  
      const fullUrl = `${req.protocol}://${req.hostname}:${ENV.PORT}/`;
 
      if (!file) {
        return {
          success: false,
          message: 'Image not provided',
        };
      }
      const category = await this.categoryModel.findOne({
        categoryName: req.body.category,
      });
      if (category) {
        return {
          success: false,
          message: 'Category all ready axists.',
        };
      }

      const cat = await this.categoryModel.create({
        baseUrl: fullUrl,
        filePath: file.path,
        categoryName: req.body.category,
      });

      return {
        success: true,
        message: 'Category Created Successfully.',
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
  async editCategory(
    file: Express.Multer.File,
    id: string,
    req: Request,
    categoryId,
  ) {
    try {
      const fullUrl = `${req.protocol}://${req.hostname}:${ENV.PORT}/`;
      const data = await this.categoryModel.findOne({
        categoryName: req.body.category,
        _id: { $ne: new mongoose.Types.ObjectId(categoryId) },
      });
      if (data) {
        return {
          success: false,
          message: 'Category all ready exists.',
        };
      }
      if (!file) {
        await this.categoryModel.findByIdAndUpdate(categoryId, {
          categoryName: req.body.category,
        });

        return {
          success: true,
          message: 'Category Updated',
        };
      }

      await this.categoryModel.findByIdAndUpdate(categoryId, {
        categoryName: req.body.category,
        baseUrl: fullUrl,
        filePath: file.path,
      });

      return {
        success: true,
        message: 'Category Updated',
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  async getAllCategory(id) {
    try {
      const admin = await this.adminModel.findById(id);

      if (!admin) {
        return {
          success: false,
          message: 'Admin not found',
        };
      }

      const category = await this.categoryModel.paginate({});
      return {
        success: true,
        message: 'Category find successfully.',
        data: category,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async deleteCategory(id, categoryId) {
    try {
      const admin = await this.adminModel.findById(id);
      if (!admin) {
        return {
          success: false,
          message: 'Admin not found!.',
        };
      }
      await this.categoryModel.findByIdAndDelete(categoryId);
      return {
        success: true,
        message: 'Category deleted Successfully.',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
  async EnableDisableCategory(id, categoryId) {
    try {
      const admin = await this.adminModel.findById(id);
      if (!admin) {
        return {
          success: false,
          message: 'Admin not found!.',
        };
      }
    const category=  await this.categoryModel.findById(categoryId);
    if(!category){
      return {
        success:false,
        message:'Category not found'
      }
    }
    await this.categoryModel.findByIdAndUpdate(categoryId,{status:!category.status})
      return {
        success: true,
        message: 'Category Status Updated Successfully.',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async AllCategory(id) {
    try {
      const admin = await this.adminModel.findById(id);
      if (!admin) {
        return {
          success: false,
          message: 'Admin not found!.',
        };
      }
      const category = await this.categoryModel.find({});
      return {
        success: true,
        message: 'Category found Successfully.',
        data: category,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async AddLearning(id, body) {
    try {
      const admin = await this.adminModel.findById(id);
      if (!admin) {
        return {
          success: false,
          message: 'Admin not found!.',
        };
      }
      await this.learningModel.create(body);
      return {
        success: true,
        message: 'Learning Created.',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async EditLearning(id, body, learningId) {
    try {
      const admin = await this.adminModel.findById(id);
      if (!admin) {
        return {
          success: false,
          message: 'Admin not found!.',
        };
      }
      await this.learningModel.findByIdAndUpdate(learningId, body);
      return {
        success: true,
        message: 'Learning Updated.',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
  async AllLearning(id, body) {
    try {
      const admin = await this.adminModel.findById(id);
      if (!admin) {
        return {
          success: false,
          message: 'Admin not found!.',
        };
      }
      const data = await this.learningModel.aggregate([
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'result',
          },
        },
        {
          $unwind: {
            path: '$result',
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);
      return {
        success: true,
        message: 'All Learning.',
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async deleteLearning(id, learningId) {
    try {
      console.log(learningId);
      const admin = await this.adminModel.findById(id);
      if (!admin) {
        return {
          success: false,
          message: 'Admin not found!.',
        };
      }
      await this.learningModel.findByIdAndDelete(learningId);
      return {
        success: true,
        message: 'Deleted Successfully.',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getAllLearningInfo(id) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        return {
          success: false,
          message: 'User not found!.',
        };
      }
      const category = await this.categoryModel.aggregate([{$match:{
        status:true
      }},
        {
          $lookup: {
            from: 'learnings',
            localField: '_id',
            foreignField: 'categoryId',
            as: 'result',
          },
        },
      ]);

      return {
        success: true,
        message: 'Learning info found successfully.',
        data: category,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
