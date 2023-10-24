import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Admin } from 'src/admin/schema/admin.schema';
import { User } from 'src/users/schema/user.schema';
import { Bank } from './schema/bank.schema';
import { Transaction } from './schema/transaction.schema';

@Injectable()
export class TransactionService {
  constructor(

    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Transaction') private transactionModel: Model<Transaction>,
    @InjectModel('Bank') private bankModel: Model<Bank>,
    @InjectModel('Admin') private adminModel: Model<Admin>,

  ) { }

  async getUserTransaction(userId: string) {
    try {
      const transaction = await this.transactionModel.find({ userId: userId }).sort({ updatedAt: -1 })
      return {
        success: true,
        data: transaction,
        message: "Find Successfully."
      }

    } catch (error) {
      return {
        success: false,
        message: error.message
      }

    }
  }

  async getAdminTransaction(userId: string, page: number, search, body) {


    try {

      const transaction = await this.transactionModel.aggregate([
        {
          '$lookup': {
            'from': 'users',
            'localField': 'userId',
            'foreignField': '_id',
            'as': 'user'
          }
        }, {
          '$unwind': {
            'path': '$user',
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$match': {
            $or: [{ accountName: { '$regex': `.*${search}.*`, '$options': 'i' } }, { accountNumber: { '$regex': `.*${search}.*`, '$options': 'i' } }, { bankName: { '$regex': `.*${search}.*`, '$options': 'i' } }, { "user.username": { '$regex': `.*${search}.*`, '$options': 'i' } }, { reason: { '$regex': `.*${search}.*`, '$options': 'i' } }]

          }
        }, {
          '$sort': body
        }
        , {
          '$group': {
            '_id': null,
            'count': { '$sum': 1 },
            'entries': { '$push': "$$ROOT" }
          }
        }, {
          '$addFields': {
            entries: { $slice: ["$entries", (page - 1) * 10, 10] }
          }
        }
      ])


      return {
        success: true,
        data: transaction[0]?.entries || [],
        totalPage: Math.ceil((transaction[0]?.count || 1) / 10),
        page: page,
        message: 'All Transaction'

      }

    } catch (error) {
      return {
        success: false,
        message: error.message
      }

    }
  }
  async downloadTransaction(userId: string, search, body) {


    try {

      const transaction = await this.transactionModel.aggregate([
        {
          '$lookup': {
            'from': 'users',
            'localField': 'userId',
            'foreignField': '_id',
            'as': 'user'
          }
        }, {
          '$unwind': {
            'path': '$user',
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$match': {
            $or: [{ accountName: { '$regex': `.*${search}.*`, '$options': 'i' } }, { accountNumber: { '$regex': `.*${search}.*`, '$options': 'i' } }, { bankName: { '$regex': `.*${search}.*`, '$options': 'i' } }, { "user.username": { '$regex': `.*${search}.*`, '$options': 'i' } }, { reason: { '$regex': `.*${search}.*`, '$options': 'i' } }]

          }
        }, {
          '$sort': body
        }
        , {
          "$project": {
            _id: 1,
            userId: 1,
            accountName: 1,
            accountNumber: 1,
            bankName: 1,
            createdAt: 1,
            reason: 1,
            reqAmount: 1,
            status: 1,
            updatedAt: 1,
            username: { $toLower: "$user.username" }

          }
        }
      ])


      return {
        success: true,
        data: transaction,

        message: 'All Transaction'

      }

    } catch (error) {
      return {
        success: false,
        message: error.message
      }

    }
  }
  async updateAdminTransaction(userId: string, body) {
    const transaction = await this.transactionModel.findById(body.id)

    if (!transaction) {
      return {
        success: false,
        message: 'Transaction not found!.'
      }
    }
    if (body.type == 'Process') {
  
      await this.transactionModel.findByIdAndUpdate(body.id, { status: 'Process' })
      return {
        success: true,
        message: 'Updated Successfully.'
      }
    } else if (body.type == 'Failed') {
      await this.transactionModel.findByIdAndUpdate(body.id, { status: "Failed", reason: body.reason })
      await this.userModel.findByIdAndUpdate(transaction.userId, {
        $inc: { walletAmount: transaction.reqAmount, requestAmount: -transaction.reqAmount },
      })
      return {
        success: true,
        message: 'Updated Successfully.'
      }
    } else if (body.type == "Success") {
      await this.transactionModel.findByIdAndUpdate(body.id, { status: "Success", reason: body.reason })
      await this.userModel.findByIdAndUpdate(transaction.userId, {
        $inc: { withdrawAmount: transaction.reqAmount, requestAmount: -transaction.reqAmount },
      })
      return {
        success: true,
        message: 'Updated Successfully.'
      }
    }
    return {
      success: false,
      message: 'Somthing went wrong'
    }
  }
  async getBankDetail(userId:string){
    try {
      const bank=await this.bankModel.findOne({userId:new mongoose.Types.ObjectId(userId)})
      if(!bank){
        return {
          success:false,
          message:'Bank Details not found!'
        }
      }else{
        return {
          success:true,
          message:'Bank Details Find Successfully.',
          data:bank
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Somthing went wrong'
      }
    }
  }
  async getAllBankDetail(userId: string, page: number, search, body){
    try {

      const transaction = await this.bankModel.aggregate([
        {
          '$lookup': {
            'from': 'users',
            'localField': 'userId',
            'foreignField': '_id',
            'as': 'user'
          }
        }, {
          '$unwind': {
            'path': '$user',
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$match': {
            $or: [{ accountName: { '$regex': `.*${search}.*`, '$options': 'i' } }, { accountNumber: { '$regex': `.*${search}.*`, '$options': 'i' } }, { bankName: { '$regex': `.*${search}.*`, '$options': 'i' } }, { "user.username": { '$regex': `.*${search}.*`, '$options': 'i' } }, { reason: { '$regex': `.*${search}.*`, '$options': 'i' } }]

          }
        }, {
          '$sort': body
        }
        , {
          '$group': {
            '_id': null,
            'count': { '$sum': 1 },
            'entries': { '$push': "$$ROOT" }
          }
        }, {
          '$addFields': {
            entries: { $slice: ["$entries", (page - 1) * 10, 10] }
          }
        }
      ])


      return {
        success: true,
        data: transaction[0]?.entries || [],
        totalPage: Math.ceil((transaction[0]?.count || 1) / 10),
        page: page,
        message: 'All Bank Details'

      }

    } catch (error) {
      return {
        success: false,
        message: error.message
      }

    }
  }
  async downloadBankDetails(userId: string, search, body) {


    try {

      const banks = await this.bankModel.aggregate([
        {
          '$lookup': {
            'from': 'users',
            'localField': 'userId',
            'foreignField': '_id',
            'as': 'user'
          }
        }, {
          '$unwind': {
            'path': '$user',
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$match': {
            $or: [{ accountName: { '$regex': `.*${search}.*`, '$options': 'i' } }, { accountNumber: { '$regex': `.*${search}.*`, '$options': 'i' } }, { bankName: { '$regex': `.*${search}.*`, '$options': 'i' } }, { "user.username": { '$regex': `.*${search}.*`, '$options': 'i' } }, { reason: { '$regex': `.*${search}.*`, '$options': 'i' } }]

          }
        }, {
          '$sort': body
        }
        , {
          "$project": {
            _id: 1,
            userId: 1,
            accountName: 1,
            accountNumber: 1,
            bankName: 1,
            createdAt: 1,
            reason: 1,
            reqAmount: 1,
            status: 1,
            updatedAt: 1,
            username: { $toLower: "$user.username" }

          }
        }
      ])


      return {
        success: true,
        data: banks,

        message: 'All Bank Details'

      }

    } catch (error) {
      return {
        success: false,
        message: error.message
      }

    }
  }
}
