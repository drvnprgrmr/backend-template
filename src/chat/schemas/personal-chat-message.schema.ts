import { Prop, Schema } from '@nestjs/mongoose';
import { isUUID } from 'class-validator';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ timestamps: true })
export class PersonalChatMessage {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'PersonalChat', required: true })
  from: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'PersonalChat', required: true })
  to: Types.ObjectId;

  @Prop({ type: SchemaTypes.String, default: '' })
  message: string;

  @Prop({ type: SchemaTypes.String, validate: (v: string) => isUUID(v, 4) })
  attachment?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'PersonalChatMessage' })
  replyTo: Types.ObjectId;

  @Prop({ type: SchemaTypes.Boolean, required: true, default: false })
  isRead: boolean;

  @Prop({ type: SchemaTypes.Boolean, required: true, default: false })
  isStarred: boolean;
}
