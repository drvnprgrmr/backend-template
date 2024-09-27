import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { PersonalChatMessage } from './personal-chat-message.schema';

export type PersonalChatDocument = HydratedDocument<PersonalChat>;

@Schema({ timestamps: true })
export class PersonalChat {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  participant: Types.ObjectId;

  @Prop({ type: SchemaTypes.Number, required: true, default: 0, min: 0 })
  unread: number;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: PersonalChatMessage.name,
    required: true,
  })
  lastMsg: Types.ObjectId;

  @Prop({ type: SchemaTypes.Date })
  lastActive: Date;
}

export const PersonalChatSchema = SchemaFactory.createForClass(PersonalChat);
