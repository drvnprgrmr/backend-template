import { IsNotEmpty, IsNumberString } from 'class-validator';

export class GetBankAccountNameDto {
  @IsNotEmpty()
  @IsNumberString()
  accountNumber: string;

  @IsNotEmpty()
  @IsNumberString()
  bankCode: string;
}
