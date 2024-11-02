import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Country } from '../enums/country.enum';
import { Currency } from '../enums/currency.enum';

export class ListBanksDto {
  @ValidateIf((o) => !o.currency)
  @IsEnum(Country)
  country: Country;

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

  @IsEnum(Currency)
  @IsOptional()
  currency: Currency;
}
