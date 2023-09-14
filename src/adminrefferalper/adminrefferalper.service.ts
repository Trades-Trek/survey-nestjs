import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import e from 'express';
import { Model } from 'mongoose';
import { Admin } from 'src/admin/schema/admin.schema';
import { AdminRefferalPer } from './schema/adminrefferalper.schema';

@Injectable()
export class AdminrefferalperService {
          constructor(

                    @InjectModel('Admin') private adminModel: Model<Admin>,
                    @InjectModel('AdminRefferalPer') private adminRefferalPerModel: Model<AdminRefferalPer>
          ) { }


          async getRefferalPer(userId: string) {
                    try {

                              const reff = await this.adminRefferalPerModel.findOne({})
                              return {
                                        success: true,
                                        data: reff,
                                        message: 'Find Successfully'
                              }

                    } catch (error) {
                              return {
                                        success: false,

                                        message: error.message
                              }

                    }

          }

          async addRefferalPer(userId: string, body) {
                    try {

                              let reff = await this.adminRefferalPerModel.findOne({})

                              if (reff) {
                                        reff = await this.adminRefferalPerModel.findByIdAndUpdate(reff._id, { per: body.per }, { new: true })


                              } else {
                                        reff = await this.adminRefferalPerModel.create({ per: body.per })

                              }
                              return {
                                        success: true,
                                        data: reff,
                                        message: 'Updated Successfully'
                              }

                    } catch (error) {
                              return {
                                        success: false,

                                        message: error.message
                              }

                    }

          }




}
