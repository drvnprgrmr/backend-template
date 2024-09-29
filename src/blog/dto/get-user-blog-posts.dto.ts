import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BlogPostStatus } from '../schemas/blog-post.schema';

export class GetUserBlogPostsDto {
  @IsString()
  @IsOptional()
  q?: string;

  @IsEnum(BlogPostStatus)
  @IsOptional()
  status?: BlogPostStatus;
}
