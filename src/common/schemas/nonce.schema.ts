import { Prop } from '@nestjs/mongoose';

export class Nonce {
  @Prop({ type: String, default: '' })
  value: string;

  @Prop({ type: Date, default: Date.now })
  expiresAt: Date;
}
