import { Prop, Schema } from '@nestjs/mongoose';
import { Currency } from 'src/common/enums/currency.enum';

@Schema({ _id: false, timestamps: { updatedAt: true } })
export class Wallet {
  @Prop()
  pin?: string;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  balance: number;

  @Prop({ type: String, required: true, enum: Currency, default: Currency.NGN })
  currency: Currency;
}
