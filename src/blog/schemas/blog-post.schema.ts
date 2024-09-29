import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export enum BlogPostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  PRIVATE = 'private',
}

export type BlogPostDocument = HydratedDocument<BlogPost>;

@Schema({ timestamps: true })
export class BlogPost {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  body: string;

  @Prop({ type: String, required: true, enum: BlogPostStatus })
  status: BlogPostStatus;

  @Prop()
  tags: string[];
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);
