import { IsEnum } from 'class-validator';
import { FollowType } from '../schemas/follow.schema';

export class GetFollows {
  @IsEnum(FollowType)
  type: FollowType;
}
