import { IsOptional, IsString } from 'class-validator';
import { EmailValidator } from 'src/common/decorators';

export class ContactDto {
  @EmailValidator()
  email: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  first_name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsString()
  @IsOptional()
  postal_code?: string;

  @IsString()
  @IsOptional()
  state_province_region?: string;
}
