import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { Types } from 'mongoose';
import { ToObjectId } from 'src/common/decorators';
import { KebabCaseRegex } from 'src/common/regex';
import { BlogPostStatus } from '../schemas/blog-post.schema';

export class UpdateBlogPostDto {
  @ToObjectId()
  id: Types.ObjectId;

  @Matches(KebabCaseRegex)
  @IsOptional()
  path?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  body?: string;

  @IsEnum(BlogPostStatus)
  @IsOptional()
  status?: BlogPostStatus;

  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
