import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from 'src/admin/schema/admin.schema';
import { UserSchema } from 'src/users/schema/user.schema';
import { BankSchema } from './schema/bank.schema';
import { TransactionSchema } from './schema/transaction.schema';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
  imports: [
    MongooseModule.forFeature([
      { name: 'Transaction', schema: TransactionSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Bank', schema: BankSchema },
      { name: 'Admin', schema: AdminSchema },



    ]),
  ],
})
export class TransactionModule {}
