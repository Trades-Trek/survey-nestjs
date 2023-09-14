import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from 'src/admin/schema/admin.schema';
import { Holiday } from './schema/holiday.schema';
import * as PaginateModel from 'mongoose-paginate';
import { NegerianDateZone } from 'src/helpers/NegerianTimeZone';

@Injectable()
export class HolidayService {
     constructor(
          @InjectModel('Holiday') private holidayModel: PaginateModel<Holiday>,
          @InjectModel('Admin') private adminModel: Model<Admin>,

     ) { }


     // create Holiday 
     async createHoliday(body) {
          try {
               const data = await this.holidayModel.create({ holidayDate: body.holidayDate, holidayName: body.holidayName ,holidayMessage:body.holidayMessage})
               return {
                    success: true,
                    message: 'Created Successfully',
                    data: data
               }
          } catch (error) {
               return {
                    success: false,
                    message: 'Internal Server Error',
                    data: null
               }

          }



     }
     async updateHoliday(body) {
          try {
               const data = await this.holidayModel.findByIdAndUpdate(body._id,{holidayName:body.holidayName,holidayDate:body.holidayDate,holidayMessage:body.holidayMessage},{new:true})
               return {
                    success: true,
                    message: 'Updated Successfully',
                    data: data
               }
          } catch (error) {
               return {
                    success: false,
                    message: 'Internal Server Error',
                    data: null
               }

          }



     }
     async deleteHoliday(body) {
      
          try {
               
               const data = await this.holidayModel.findByIdAndDelete(body.id)
               return {
                    success: true,
                    message: 'Deleted Successfully',
                    data: data
               }
          } catch (error) {
               return {
                    success: false,
                    message: 'Internal Server Error',
                    data: null
               }

          }



     }

     // get all Holiday 
     async getAllHoliday() {
          try {
              
               const data = await this.holidayModel.find({})
               const newdata=await this.holidayModel.findOne({holidayDate:NegerianDateZone()})
               let temp = [];
               data.map((item) => {
                    temp.push(item.holidayDate)
               })
               return {
                    success: true,
                    message: 'Holiday list',
                    data: temp,
                    desc:newdata?.holidayMessage||''
               }

          } catch (error) {
               return {
                    success: false,
                    message: 'Internal Server Error',
                    data: null
               }

          }

     }
     

     async getAllAdminHoliday(userId,body,page=1,search) {
          try {
               const admin=await this.adminModel.findById(userId)
             const option={
               page:page,
               sort:body
             }
               
               if(!admin){
                    return {
                         success:false,
                         message:'you are not authorized'
                    }
               }
               const data = await this.holidayModel.paginate({
                    $or: [{ holidayName: { '$regex': `.*${search}.*`, '$options': 'i' } },{ holidayMessage: { '$regex': `.*${search}.*`, '$options': 'i' } }]  
               },option)
               
               return {
                    success: true,
                    message: 'Holiday list',
                    data: data
               }

          } catch (error) {
               return {
                    success: false,
                    message: 'Internal Server Error',
                    data: null
               }

          }

     }
     async downloadAllHoliday(userId,body,search) {
          try {
               const admin=await this.adminModel.findById(userId)
            
               
               if(!admin){
                    return {
                         success:false,
                         message:'you are not authorized'
                    }
               }
               const data = await this.holidayModel.find({
                    $or: [{ holidayName: { '$regex': `.*${search}.*`, '$options': 'i' } },{ holidayMessage: { '$regex': `.*${search}.*`, '$options': 'i' } }]  
               }).sort(body)
               
               return {
                    success: true,
                    message: 'Holiday list',
                    data: data
               }

          } catch (error) {
               return {
                    success: false,
                    message: 'Internal Server Error',
                    data: null
               }

          }

     }
}
