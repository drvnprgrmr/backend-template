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

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeatureAsync([
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
