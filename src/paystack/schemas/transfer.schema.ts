import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Currency } from '../enums/currency.enum';
import { TransferStatus } from '../enums/transfer-status.enum';

export type TransferDocument = HydratedDocument<Transfer>;

@Schema({ timestamps: true })
export class Transfer {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
    immutable: true,
  })
  user: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'TransferRecipient',
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
    enum: Currency,
    required: true,
    immutable: true,
  })
  currency: Currency;

  @Prop({
    type: String,
    enum: TransferStatus,
    default: TransferStatus.PENDING,
    required: true,
  })
  status: TransferStatus;
}

export const TransferSchema = SchemaFactory.createForClass(Transfer);
