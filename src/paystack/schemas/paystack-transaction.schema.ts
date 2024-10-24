import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { UserDocument } from 'src/user/schemas/user.schema';
import { PaystackCurrency } from '../enums/paystack-currency.enum';
import { PaystackTransactionStatus } from '../enums/paystack-transaction-status.enum';

export type PaystackTransactionDocument = HydratedDocument<PaystackTransaction>;

@Schema({ timestamps: true })
export class PaystackTransaction {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId | UserDocument;

  @Prop({ type: Number })
  transactionId: number;

  @Prop({ type: Number, required: true, min: 1 })
  amount: number;

  @Prop({ type: String, enum: PaystackCurrency })
  currency: PaystackCurrency;

  @Prop({ type: String, enum: PaystackTransactionStatus })
  status: PaystackTransactionStatus;
}

export const PaystackTransactionSchema =
  SchemaFactory.createForClass(PaystackTransaction);
