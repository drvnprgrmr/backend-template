import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type FollowDocument = HydratedDocument<Follow>;

export enum FollowType {
  FOLLOWER = 'follower',
  FOLLOWING = 'following',
}

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Follow {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  follower: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  following: Types.ObjectId;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);
