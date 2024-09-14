import { Prop } from '@nestjs/mongoose';

export class Nonce {
  @Prop()
  value: string;

  @Prop()
  expiresAt: Date;
}
