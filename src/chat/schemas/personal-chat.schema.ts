import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type PersonalChatDocument = HydratedDocument<PersonalChat>;

@Schema({ timestamps: true })
export class PersonalChat {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  participant: Types.ObjectId;

  @Prop({ type: SchemaTypes.Number, required: true, default: 0, min: 0 })
  unread: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'PersonalChatMessage' })
  lastMsg: Types.ObjectId;

  @Prop({ type: SchemaTypes.Date })
  lastActive: Date;
}

export const PersonalChatSchema = SchemaFactory.createForClass(PersonalChat);
