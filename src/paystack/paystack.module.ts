import { Module } from '@nestjs/common';
import { PaystackService } from './paystack.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { UserModule } from 'src/user/user.module';
import { PaystackController } from './paystack.controller';
import {
  TransferRecipient,
  TransferRecipientSchema,
} from './schemas/transfer-recipient.schema';
import { Transfer, TransferSchema } from './schemas/transfer.schema';
import { Customer, CustomerSchema } from './schemas/customer.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeatureAsync([
      {
        name: Customer.name,
        useFactory() {
          const schema = CustomerSchema;

          return schema;
        },
      },
      {
        name: Transfer.name,
        useFactory() {
          const schema = TransferSchema;

          return schema;
        },
      },
      {
        name: TransferRecipient.name,
        useFactory() {
          const schema = TransferRecipientSchema;

          return schema;
        },
      },
      {
        name: Transaction.name,
        useFactory() {
          const schema = TransactionSchema;

          return schema;
        },
      },
    ]),
  ],
  providers: [PaystackService],
  controllers: [PaystackController],
})
export class PaystackModule {}
