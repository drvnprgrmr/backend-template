import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { PaystackRecipientType } from '../enums/paystack-recipient-type.enum';
import { PaystackCurrency } from '../enums/paystack-currency.enum';

export class CreateTransferRecipientDto {
  @IsEnum(PaystackRecipientType)
  type: PaystackRecipientType;

  @IsNumberString()
  account_number: string;

  @IsNumberString()
  bank_code: string;

  @IsEnum(PaystackCurrency)
  @IsOptional()
  currency: PaystackCurrency = PaystackCurrency.NGN;
}
