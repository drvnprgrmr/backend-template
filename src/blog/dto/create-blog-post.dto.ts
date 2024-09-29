import { IsOptional, IsString } from 'class-validator';

export class CreateBlogPostDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
