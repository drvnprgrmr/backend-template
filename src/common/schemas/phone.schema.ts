import { Prop, Schema } from '@nestjs/mongoose';
import { isPhoneNumber } from 'class-validator';

@Schema({ _id: false })
export class Phone {
  @Prop({
    type: String,
    required: true,
    trim: true,
    index: true,
    validate: { validator: (v: string) => isPhoneNumber(v) },
  })
  value: string;

  @Prop({ type: Boolean, required: true, default: false })
  verified: boolean;
}
