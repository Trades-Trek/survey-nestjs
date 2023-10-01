import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBankAccountDto } from './bank.dto';
import { BankAccount } from './schema/bank.schema';

@Injectable()
export class BankService {
  constructor(
    @InjectModel('BankAccount') private bankAccountModel: Model<BankAccount>,
  ) {}

  async getAll(): Promise<BankAccount[]> {
    return await this.bankAccountModel.find();
  }

  async getOne(id: string) {
    const data = await this.bankAccountModel.findById(id);

    return {
      success: true,
      message: `Bank details`,
      data,
    };
  }

  async create(createBankAccountDto: CreateBankAccountDto, id) {
    const data = await this.bankAccountModel.create({...createBankAccountDto, userId: id });
    return {
      success: true,
      message: `Bank created`,
      data,
    };
  }

  async delete(id: string): Promise<void> {
    await this.bankAccountModel.findByIdAndDelete(id);
  }
}
