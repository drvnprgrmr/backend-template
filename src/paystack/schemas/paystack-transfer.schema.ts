import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { PaystackCurrency } from '../enums/paystack-currency.enum';
import { PaystackTransferStatus } from '../enums/paystack-transfer-status.enum';

export type PaystackTransferDocument = HydratedDocument<PaystackTransfer>;

@Schema({ timestamps: true })
export class PaystackTransfer {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
    immutable: true,
  })
  user: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'PaystackTransferRecipient',
    required: true,
    immutable: true,
  })
  transferRecipient: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 1 })
  amount: number;

  @Prop()
  reason?: string;

  @Prop({
    type: String,
    enum: PaystackCurrency,
    required: true,
    immutable: true,
  })
  currency: PaystackCurrency;

  @Prop({
    type: String,
    enum: PaystackTransferStatus,
    default: PaystackTransferStatus.PENDING,
    required: true,
  })
  status: PaystackTransferStatus;
}

export const PaystackTransferSchema =
  SchemaFactory.createForClass(PaystackTransfer);
