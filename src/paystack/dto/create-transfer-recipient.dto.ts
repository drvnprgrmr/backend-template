import { IsEnum, IsNumberString, IsString } from 'class-validator';
import { PaystackRecipientType } from '../enums/paystack-recipient-type.enum';

export class CreateTransferRecipientDto {
  @IsEnum(PaystackRecipientType)
  type: PaystackRecipientType;

  @IsNumberString()
  account_number: string;

  @IsNumberString()
  bank_code: string;
}
