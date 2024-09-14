import { Prop } from '@nestjs/mongoose';
import { isEmail } from 'class-validator';

export class Email {
  @Prop({
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate: { validator: (v: string) => isEmail(v) },
  })
  value: string;

  @Prop({ type: Boolean, required: true, default: false })
  verified: boolean;
}
