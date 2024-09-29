import { IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { ToObjectId } from 'src/common/decorators';

export class GetPublishedBlogPostsDto {
  @ToObjectId()
  @IsOptional()
  userId?: Types.ObjectId;

  @IsString()
  @IsOptional()
  q?: string;
}
