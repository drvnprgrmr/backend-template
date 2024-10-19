import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 1, max: 5 })
  star: number;

  @Prop()
  comment?: string;
}
