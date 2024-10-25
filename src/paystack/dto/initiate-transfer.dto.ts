import { IsEnum, IsOptional, IsPositive, IsString } from 'class-validator';
import { PaystackCurrency } from '../enums/paystack-currency.enum';

export class InitiateTransferDto {
  @IsString()
  @IsOptional()
  source: string = 'balance';

  @IsPositive()
  amount: number;

  @IsString()
  recipient: string;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsEnum(PaystackCurrency)
  @IsOptional()
  currency: PaystackCurrency = PaystackCurrency.NGN;
}
