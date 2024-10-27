import { Module } from '@nestjs/common';
import { PaystackService } from './paystack.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PaystackTransaction,
  PaystackTransactionSchema,
} from './schemas/paystack-transaction.schema';
import { UserModule } from 'src/user/user.module';
import { PaystackController } from './paystack.controller';
import {
  PaystackTransferRecipient,
  PaystackTransferRecipientSchema,
} from './schemas/paystack-transfer-recipient.schema';
import {
  PaystackTransfer,
  PaystackTransferSchema,
} from './schemas/paystack-transfer.schema';
import {
  PaystackCustomer,
  PaystackCustomerSchema,
} from './schemas/paystack-customer.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeatureAsync([
      {
        name: PaystackCustomer.name,
        useFactory() {
          const schema = PaystackCustomerSchema;

          return schema;
        },
      },
      {
        name: PaystackTransfer.name,
        useFactory() {
          const schema = PaystackTransferSchema;

          return schema;
        },
      },
      {
        name: PaystackTransferRecipient.name,
        useFactory() {
          const schema = PaystackTransferRecipientSchema;

          return schema;
        },
      },
      {
        name: PaystackTransaction.name,
        useFactory() {
          const schema = PaystackTransactionSchema;

          return schema;
        },
      },
    ]),
  ],
  providers: [PaystackService],
  controllers: [PaystackController],
})
export class PaystackModule {}
