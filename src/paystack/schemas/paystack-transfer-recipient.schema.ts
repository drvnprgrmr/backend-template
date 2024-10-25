import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isNumberString } from 'class-validator';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { UserDocument } from 'src/user/schemas/user.schema';

export type PaystackTransferRecipientDocument =
  HydratedDocument<PaystackTransferRecipient>;

@Schema({ timestamps: { createdAt: true } })
export class PaystackTransferRecipient {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId | UserDocument;

  @Prop({ type: String, required: true })
  recipient_code: string;

  @Prop({
    type: String,
    required: true,
    validate: {
      validator: (v: string) => isNumberString(v),
      message: 'Not a valid number string.',
    },
  })
  account_number: string;

  @Prop({ type: String, required: true })
  account_name: string;

  @Prop({ type: String, required: true })
  bank_code: string;

  @Prop({ type: String, required: true })
  bank_name: string;
}

export const PaystackTransferRecipientSchema = SchemaFactory.createForClass(
  PaystackTransferRecipient,
);
