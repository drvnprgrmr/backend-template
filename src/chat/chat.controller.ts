import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { UserGuard, UserPopulatedRequest } from 'src/user/user.guard';
import { CreatePersonalChatDto } from './dto/create-personal-chat.dto';

@Controller('/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(UserGuard)
  @Post('/personal')
  createPersonalChat(
    @Req() req: UserPopulatedRequest,
    @Body() dto: CreatePersonalChatDto,
  ) {
    return this.chatService.createPersonalChat(req.user.id, dto);
  }
}
