import { IsOptional, IsString } from 'class-validator';

export class GetUsersDto {
  @IsString()
  @IsOptional()
  q?: string;
}
