import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PersonalChat } from './schemas/personal-chat.schema';
import { Model, Types } from 'mongoose';
import { PersonalChatMessage } from './schemas/personal-chat-message.schema';
import { CreatePersonalChatDto } from './dto/create-personal-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(PersonalChat.name)
    private readonly personalChatModel: Model<PersonalChat>,
    @InjectModel(PersonalChatMessage.name)
    private readonly personalChatMessageModel: Model<PersonalChatMessage>,
  ) {}

  async createPersonalChat(userId: Types.ObjectId, dto: CreatePersonalChatDto) {
    const { participantId } = dto;

    if (userId.equals(participantId))
      throw new BadRequestException({
        message: 'Personal self chats not supported!',
      });

    let userPersonalChat = await this.personalChatModel
      .findOne({
        user: userId,
        participant: participantId,
      })
      .select('_id')
      .lean()
      .exec();

    if (userPersonalChat)
      throw new BadRequestException({
        message: 'User already has a personal chat with this participant.',
      });

    userPersonalChat = await this.personalChatModel.create({
      user: userId,
      participant: participantId,
    });

    // note: might want to do the next part conditionally if the other user does not want just anyone to chat them

    let participantPersonalChat = await this.personalChatModel
      .findOne({
        user: participantId,
        participant: userId,
      })
      .select('_id')
      .lean()
      .exec();

    if (participantPersonalChat)
      throw new BadRequestException({
        message: 'Participant already has a personal chat with this user.',
      });

    participantPersonalChat = await this.personalChatModel.create({
      user: participantId,
      participant: userId,
    });

    return { message: 'Personal chat created!', data: { userPersonalChat } };
  }
}
