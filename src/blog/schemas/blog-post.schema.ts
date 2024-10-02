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

  // todo: add maxlength
  @Prop({ type: String, required: true, unique: true })
  path: string;

  // todo: thinking of storing only the uuid and adding method for getting the full url instead.
  banner?: string;

  @Prop({ type: String, required: true })
  title: string;

  // todo: add maxlength
  @Prop({ type: String, required: true })
  preview: string;

  @Prop({ type: String, required: true })
  body: string;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  reads: number;

  @Prop({
    type: String,
    required: true,
    enum: BlogPostStatus,
    default: BlogPostStatus.DRAFT,
  })
  status: BlogPostStatus;

  @Prop()
  tags: string[];
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);
