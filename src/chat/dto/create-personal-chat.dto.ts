import { Types } from 'mongoose';
import { ToObjectId } from 'src/common/decorators';

export class CreatePersonalChatDto {
  @ToObjectId()
  participantId: Types.ObjectId;
}
