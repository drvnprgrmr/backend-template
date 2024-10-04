import { IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { EmailValidator } from 'src/common/decorators';

export enum FormCategory {}

export class SubmitFormDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @EmailValidator()
  email: string;

  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsEnum(FormCategory)
  @IsOptional()
  category?: FormCategory;

  @IsString()
  message: string;

  // todo: add recaptcha
}
