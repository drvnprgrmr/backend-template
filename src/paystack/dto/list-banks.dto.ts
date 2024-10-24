import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { PaystackCountry } from '../enums/paystack-country.enum';
import { Type } from 'class-transformer';
import { PaystackCurrency } from '../enums/paystack-currency.enum';

export class ListBanksDto {
  @ValidateIf((o) => !o.currency)
  @IsEnum(PaystackCountry)
  country: PaystackCountry;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  perPage: number = 10;

  @IsString()
  @IsOptional()
  previous: string;

  @IsString()
  @IsOptional()
  next: string;

  @IsEnum(PaystackCurrency)
  @IsOptional()
  currency: PaystackCurrency;
}
