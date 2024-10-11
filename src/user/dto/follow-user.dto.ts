import { Types } from 'mongoose';
import { ToObjectId } from 'src/common/decorators';

export class FollowUserDto {
  @ToObjectId()
  followingId: Types.ObjectId;
}
