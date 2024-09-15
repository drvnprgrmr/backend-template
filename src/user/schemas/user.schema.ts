import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Gender } from 'src/common/enums';
import { Email, Name, Nonce, Phone, Wallet } from 'src/common/schemas';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: Name })
  name?: Name;

  @Prop({ type: Email })
  email?: Email;

  @Prop({ type: Phone })
  phone?: Phone;

  @Prop()
  password?: string;

  @Prop({ type: String, enum: Gender })
  gender?: Gender;

  @Prop({ type: Date })
  birthday?: Date;

  @Prop({ type: Nonce })
  nonce?: Nonce;

  wallet?: Wallet;
}

export const UserSchema = SchemaFactory.createForClass(User);
