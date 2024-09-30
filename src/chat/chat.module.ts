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
import { ChatController } from './chat.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
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
  controllers: [ChatController],
})
export class ChatModule {}
