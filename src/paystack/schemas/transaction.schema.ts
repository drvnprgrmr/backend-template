import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { UserDocument } from 'src/user/schemas/user.schema';
import { Currency } from '../enums/currency.enum';
import { TransactionStatus } from '../enums/transaction-status.enum';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
    immutable: true,
  })
  user: Types.ObjectId | UserDocument;

  @Prop({ type: Number, immutable: true })
  transactionId: number;

  @Prop({ type: Number, required: true, min: 1, immutable: true })
  amount: number;

  @Prop({ type: String, enum: Currency, immutable: true })
  currency: Currency;

  @Prop({ type: String, enum: TransactionStatus })
  status: TransactionStatus;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
