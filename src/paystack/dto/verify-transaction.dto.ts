import { IsString } from 'class-validator';

export class VerifyTransactionDto {
  @IsString()
  reference: string;
}
