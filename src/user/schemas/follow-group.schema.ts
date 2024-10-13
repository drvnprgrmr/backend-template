import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type FollowGroupDocument = HydratedDocument<FollowGroup>;

export enum FollowType {
  FOLLOWER = 'follower',
  FOLLOWING = 'following',
}

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class FollowGroup {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  follower: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  following: Types.ObjectId;
}

export const FollowGroupSchema = SchemaFactory.createForClass(FollowGroup);
