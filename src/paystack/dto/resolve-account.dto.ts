import { IsNumberString } from 'class-validator';

export class ResolveAccountDto {
  @IsNumberString()
  account_number: string;

  @IsNumberString()
  bank_code: string;
}
