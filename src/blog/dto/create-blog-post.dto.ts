import { IsOptional, IsString, Matches } from 'class-validator';
import { KebabCaseRegex } from 'src/common/regex';

export class CreateBlogPostDto {
  @Matches(KebabCaseRegex)
  @IsOptional()
  path?: string;

  @IsString()
  title: string;

  @IsString()
  preview: string;

  @IsString()
  body: string;

  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
