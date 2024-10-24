import { Type } from 'class-transformer';
import { IsEnum, IsJSON, IsOptional, IsPositive } from 'class-validator';
import { PaystackCurrency } from '../enums/paystack-currency.enum';

export class InitializeTransactionDto {
  @Type(() => Number)
  @IsPositive()
  amount: number;

  @IsEnum(PaystackCurrency)
  @IsOptional()
  currency?: PaystackCurrency;

  @IsJSON()
  @IsOptional()
  metadata?: string;
}
