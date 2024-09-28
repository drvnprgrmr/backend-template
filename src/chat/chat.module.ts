import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PersonalChat,
  PersonalChatSchema,
} from './schemas/personal-chat.schema';
import {
  PersonalChatMessage,
  PersonalChatMessageSchema,
} from './schemas/personal-chat-message.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: PersonalChat.name,
        useFactory() {
          const schema = PersonalChatSchema;

          return schema;
        },
      },
      {
        name: PersonalChatMessage.name,
        useFactory() {
          const schema = PersonalChatMessageSchema;

          return schema;
        },
      },
    ]),
  ],
  providers: [ChatService],
})
export class ChatModule {}
