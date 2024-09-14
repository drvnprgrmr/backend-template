import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false, timestamps: true })
export class Wallet {
  @Prop()
  pin?: string;

  @Prop({ type: String, required: true, min: 0, default: 0 })
  balance: number;
}
