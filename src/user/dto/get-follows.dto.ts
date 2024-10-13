import { IsEnum } from 'class-validator';
import { FollowType } from '../schemas/follow-group.schema';

export class GetFollows {
  @IsEnum(FollowType)
  type: FollowType;
}
