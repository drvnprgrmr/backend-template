import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { EmailValidator, TitleValidator } from 'src/common/decorators';
import { Gender } from 'src/common/enums';

/**
 * All fields are made optional by default.
 * Modify to suit the app's requirements.
 */
export class SignupDto {
  @IsString()
  @IsOptional()
  username?: string;

  @TitleValidator()
  @IsOptional()
  'name.first'?: string;

  @TitleValidator()
  @IsOptional()
  'name.last'?: string;

  @EmailValidator()
  @IsOptional()
  'email.value'?: string;

  @IsPhoneNumber()
  @IsOptional()
  'phone.value'?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsStrongPassword()
  @IsOptional()
  password?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @Type(() => Date)
  @IsDateString()
  @IsOptional()
  birthday?: Date;
}
