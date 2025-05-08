import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Gender } from 'src/common/enums';
import { Email, Name, Nonce, Phone, TOTP, Wallet } from 'src/common/schemas';

export type UserDocument = HydratedDocument<User>;

// todo: add max and min length constants and add enforce in dtos

export enum UserVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

/**
 * All attributes are not required by default.
 * Modify to suit the app's requirements.
 */
@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  })
  username: string;

  @Prop({ type: Name })
  name: Name;

  @Prop({ type: Email })
  email: Email;

  @Prop({ type: Phone })
  phone?: Phone;

  @Prop()
  bio?: string;

  @Prop()
  password: string;

  @Prop({ type: TOTP })
  totp: TOTP;

  @Prop({ type: String, enum: Gender, default: Gender.NOT_STATED })
  gender: Gender;

  @Prop({ type: Date })
  birthday: Date;

  @Prop({ type: Nonce })
  nonce: Nonce;

  @Prop({ type: Wallet, required: true, default: () => ({}) })
  wallet: Wallet;

  @Prop()
  fcmToken?: string;

  @Prop({
    type: String,
    required: true,
    enum: UserVisibility,
    default: UserVisibility.PUBLIC,
  })
  visibility: UserVisibility;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  numFollowing: number;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  numFollowers: number;

  @Prop({ type: Number, min: 0, default: 0 })
  unreadNotifications: number;

  // todo: isSocketOnline
}

export const UserSchema = SchemaFactory.createForClass(User);
