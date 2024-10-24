import { Type } from 'class-transformer';
import { IsEnum, IsJSON, IsOptional, IsPositive } from 'class-validator';
import { EmailValidator } from 'src/common/decorators';
import { Currency } from '../enums/currency.enum';

export class InitializeTransactionDto {
  @Type(() => Number)
  @IsPositive()
  amount: number;

  @EmailValidator()
  email: string;

  @IsEnum(Currency)
  @IsOptional()
  currency?: string;

  @IsJSON()
  metadata?: string;
}
