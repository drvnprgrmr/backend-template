import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsNotEmptyObject,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Currency } from '../enums/currency.enum';

const associations = ['user:wallet:fund'];
class Metadata {
  @IsIn(associations)
  association: string;
}

export class InitializeTransactionDto {
  @Type(() => Number)
  @IsPositive()
  amount: number;

  @IsEnum(Currency)
  currency: Currency;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => Metadata)
  metadata: Metadata;
}
