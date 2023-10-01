import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BankAccountSchema } from './schema/bank.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "BankAccount", schema: BankAccountSchema }
    ])],
  controllers: [BankController],
  providers: [BankService]
})
export class BankModule {}
