import { Prop } from '@nestjs/mongoose';

export class Rating {
  @Prop({ type: Number, required: true, default: 0, min: 0, max: 5 }) // Five-star rating system
  avg: number;

  @Prop({ type: Number, required: true, default: 0, min: 0 })
  count: number;
}
