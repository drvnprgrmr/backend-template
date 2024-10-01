import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isUUID } from 'class-validator';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type PersonalChatMessageDocument = HydratedDocument<PersonalChatMessage>;

@Schema({ timestamps: true })
export class PersonalChatMessage {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  participant: Types.ObjectId;

  @Prop({ type: SchemaTypes.String, default: '' })
  message: string;

  @Prop({ type: SchemaTypes.String, validate: (v: string) => isUUID(v, 4) })
  attachment?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'PersonalChatMessage' })
  replyTo?: Types.ObjectId;

  @Prop({ type: SchemaTypes.Boolean, required: true, default: false })
  isRead: boolean;

  @Prop({ type: SchemaTypes.Boolean, required: true, default: false })
  isStarred: boolean;
}

export const PersonalChatMessageSchema =
  SchemaFactory.createForClass(PersonalChatMessage);
