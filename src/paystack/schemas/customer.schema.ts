import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isEmail, isPhoneNumber } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';
import { UserDocument } from 'src/user/schemas/user.schema';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({ timestamps: true })
export class Customer {
  user: Types.ObjectId | UserDocument;

  @Prop({ type: String, required: true })
  customer_code: string;

  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop({
    type: String,
    required: true,
    validate: (v: string) => isEmail(v),
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    validate: (v: string) => isPhoneNumber(v),
  })
  phone: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
