import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isURL } from 'class-validator';
import { Types, HydratedDocument, SchemaTypes } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

export type NotificationDocument = HydratedDocument<Notification>;

// add based on application needs
export enum NotificationType {
  _ = '_',
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  user: Types.ObjectId | User;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  body: string;

  @Prop({ type: String, validate: (v: string) => isURL(v) })
  image?: string;

  @Prop({
    type: String,
    required: true,
    enum: NotificationStatus,
    default: NotificationStatus.UNREAD,
  })
  status: NotificationStatus;

  @Prop({ type: String, enum: NotificationType })
  type: NotificationType;

  @Prop({ type: SchemaTypes.Mixed })
  payload?: Record<string, string>;

  @Prop({ type: Boolean, required: true, default: false })
  keep: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
