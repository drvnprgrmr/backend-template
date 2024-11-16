import { Prop } from '@nestjs/mongoose';
import { isBase32, isURL } from 'class-validator';

export enum TOTPStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
}

export class TOTP {
  @Prop({ type: TOTPStatus, required: true, default: TOTPStatus.DISABLED })
  status: TOTPStatus;

  @Prop({ type: String, validate: (v: string) => isBase32(v) })
  secret?: string;

  @Prop({
    type: String,
    validate: (v: string) =>
      isURL(v, { protocols: ['otpauth'], require_tld: false }),
  })
  authUrl?: string;
}
