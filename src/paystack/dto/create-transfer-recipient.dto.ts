import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { RecipientType } from '../enums/recipient-type.enum';
import { Currency } from '../enums/currency.enum';

export class CreateTransferRecipientDto {
  @IsEnum(RecipientType)
  type: RecipientType;

  @IsNumberString()
  account_number: string;

  @IsNumberString()
  bank_code: string;

  @IsEnum(Currency)
  @IsOptional()
  currency: Currency = Currency.NGN;
}
