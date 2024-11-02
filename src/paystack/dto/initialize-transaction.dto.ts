import { Type } from 'class-transformer';
import { IsEnum, IsJSON, IsOptional, IsPositive } from 'class-validator';
import { Currency } from '../enums/currency.enum';

export class InitializeTransactionDto {
  @Type(() => Number)
  @IsPositive()
  amount: number;

  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency;

  @IsJSON()
  @IsOptional()
  metadata?: string;
}
