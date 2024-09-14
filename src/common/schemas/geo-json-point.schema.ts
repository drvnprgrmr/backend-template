import { Prop } from '@nestjs/mongoose';

export class GeoJsonPoint {
  @Prop({ type: String, required: true, default: 'Point', immutable: true })
  type: string;

  @Prop({
    type: [Number],
    required: true,
    validate: [
      {
        validator: (v: number[]) => v.length === 2,
        message: 'Must contain only [longitude, latitude]',
      },
      {
        validator: (v: number[]) => v[0] >= -180 && v[0] <= 180,
        message: 'Invalid longitude. -180 <= longitude <= 180',
      },
      {
        validator: (v: number[]) => v[1] >= -90 && v[1] <= 90,
        message: 'Invalid latitude. -90 <= latitude <= 90',
      },
    ],
  })
  coordinates: number[];
}
