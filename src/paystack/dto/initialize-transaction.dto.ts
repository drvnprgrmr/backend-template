import { Type } from 'class-transformer';
import { IsEnum, IsJSON, IsPositive } from 'class-validator';
import { Currency } from '../enums/currency.enum';

// @ValidatorConstraint({ async: true })
// class ValidateMetadata implements ValidatorConstraintInterface {
//   async validate(
//     value: string,
//     validationArguments?: ValidationArguments,
//   ): Promise<boolean> {
//     const obj: Record<string, any> & { association: string } =
//       JSON.parse(value);
//
//     if (!isObject(obj)) return false;
//
//     // todo: find a better way (probably use enums)
//     if (!['wallet'].includes(obj.association)) return false;
//
//     return true;
//   }
//   defaultMessage(validationArguments?: ValidationArguments): string {
//     return 'Invalid metadata object';
//   }
// }

export class InitializeTransactionDto {
  @Type(() => Number)
  @IsPositive()
  amount: number;

  @IsEnum(Currency)
  currency: Currency;

  @IsJSON()
  metadata: string;
}
