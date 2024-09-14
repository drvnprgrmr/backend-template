import { Prop } from '@nestjs/mongoose';
import { GeoJsonPoint } from './geo-json-point.schema';

export const COUNTRY_MAX_LENGTH = 54;
export const CITY_MAX_LENGTH = 100;
export const STATE_MAX_LENGTH = 100;
export const ADDRESS_MAX_LENGTH = 120;

export class Location {
  @Prop({
    type: String,
    trim: true,
    maxlength: COUNTRY_MAX_LENGTH,
  })
  country?: string;

  @Prop({
    type: String,
    trim: true,
    maxlength: CITY_MAX_LENGTH,
  })
  city?: string;

  @Prop({
    type: String,
    trim: true,
    maxlength: STATE_MAX_LENGTH,
  })
  state?: string;

  @Prop({
    type: String,
    trim: true,
    maxlength: ADDRESS_MAX_LENGTH,
  })
  address?: string;

  @Prop({ type: GeoJsonPoint, index: '2dsphere' })
  geoPoint?: GeoJsonPoint;
}
