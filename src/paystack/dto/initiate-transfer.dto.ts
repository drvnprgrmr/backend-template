import { IsEnum, IsOptional, IsPositive, IsString } from 'class-validator';
import { Currency } from '../enums/currency.enum';

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

  @IsEnum(Currency)
  @IsOptional()
  currency: Currency = Currency.NGN;
}
