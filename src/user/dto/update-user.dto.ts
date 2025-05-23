import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { EmailValidator, TitleValidator } from 'src/common/decorators';
import { Gender } from 'src/common/enums';
import { UserVisibility } from '../schemas/user.schema';

export class UpdateUserDto {
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

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsDateString()
  @IsOptional()
  birthday?: Date;

  @IsEnum(UserVisibility)
  @IsOptional()
  visibility?: UserVisibility;
}
