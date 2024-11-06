import { Transform, Type } from 'class-transformer';
import { IsEnum, isObject, IsPositive } from 'class-validator';
import { Currency } from '../enums/currency.enum';

export class InitializeTransactionDto {
  @Type(() => Number)
  @IsPositive()
  amount: number;

  @IsEnum(Currency)
  currency: Currency;

  @Transform((params) => {
    const value: string = params.value;

    const obj: Record<string, any> & { association: string } =
      JSON.parse(value);

    if (!isObject(obj)) throw new Error('Expected JSON Object.');

    // todo: find a better way (probably use enums)
    if (!['wallet'].includes(obj.association))
      throw new Error('invalid association');
  })
  metadata: string;
}
