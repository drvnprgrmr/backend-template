import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PersonalChat } from './schemas/personal-chat.schema';
import { isValidObjectId, Model, Types } from 'mongoose';
import { PersonalChatMessage } from './schemas/personal-chat-message.schema';
import { CreatePersonalChatDto } from './dto/create-personal-chat.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { SocketData } from 'src/sockets/sockets.gateway';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @InjectModel(PersonalChat.name)
    private readonly personalChatModel: Model<PersonalChat>,
    @InjectModel(PersonalChatMessage.name)
    private readonly personalChatMessageModel: Model<PersonalChatMessage>,
    private readonly userService: UserService,
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

  @OnEvent('chat:personal:message:create')
  async createPersonalChatMessage(
    socketData: SocketData,
    data: {
      to: string;
      message: string;
    },
  ) {
    const userId = socketData.user.id;
    const { to, message } = data;

    if (!isValidObjectId(to)) return this.logger.error('Invalid ObjectId.');

    const participantId = new Types.ObjectId(to);

    const user = await this.userService.userModel.findById(userId).exec();

    const particapantPersonalChat = await this.personalChatModel
      .findOne({
        user: participantId,
        participant: userId,
      })
      .exec();

    const personalChatMessage = await this.personalChatMessageModel.create({
      user: userId,
      participant: participantId,
    });
  }
}
// todo: online status
// todo: chat presence indicator

//   @SubscribeMessage('chat-message')
//   async handleChatMessage(
//     @ConnectedSocket() socket: Socket,
//     @MessageBody() payload: { to: string; message: string },
//   ) {
//     const userId: string = socket.data.user.id;
//
//     const { to, message } = payload;
//
//     const chat = await this.chatService.getChat({
//       user: to,
//       participant: userId,
//     });
//
//     const chatMsg = await this.chatService.createChatMessage({
//       from: userId,
//       to,
//       message,
//     });
//
//     try {
//       const responses: any[] = await this.server
//         .timeout(5_000)
//         .to(chat.id)
//         .emitWithAck('chat-message', chatMsg);
//
//       if (!responses.some((response) => response === 'success'))
//         this.emitChatUnread(to, {
//           chatId: chat.id,
//           unreadMessages: ++chat.unreadMessages,
//         });
//     } catch (err) {
//       this.logger.error(err);
//
//       this.emitChatUnread(to, {
//         chatId: chat.id,
//         unreadMessages: ++chat.unreadMessages,
//       });
//     }
//
//     if (chat.isModified()) await chat.save();
//   }
//
//   private emitChatUnread(
//     room: string,
//     payload: { chatId: string; unreadMessages: number },
//   ) {
//     this.server.to(room).emit('chat-unread', payload);
//   }
//
//   @SubscribeMessage('chat-enter')
//   async handleJoinRoom(
//     @ConnectedSocket() socket: Socket,
//     @MessageBody() room: string,
//   ) {
//     this.logger.debug(`chat-enter: ${room}`);
//     if (!socket.rooms.has(room)) await socket.join(room);
//
//     await this.chatService.chatModel
//       .updateOne({ _id: room }, { $set: { unreadMessages: 0 } })
//       .exec();
//   }
//
//   private getSocketRooms(socket: Socket) {
//     let string = '';
//     socket.rooms.forEach((el) => (string += el + ' '));
//     return string;
//   }
//
//   @SubscribeMessage('chat-leave')
//   async handleLeaveRoom(
//     @ConnectedSocket() socket: Socket,
//     @MessageBody() room: string,
//   ) {
//     this.logger.debug(`chat-leave: ${room}`);
//     this.logger.debug(
//       `rooms before ${socket.rooms.size}: ${this.getSocketRooms(socket)}`,
//     );
//     if (socket.rooms.has(room)) await socket.leave(room);
//     this.logger.debug(
//       `rooms after ${socket.rooms.size}: ${this.getSocketRooms(socket)}`,
//     );
//   }
//
//   afterInit(server: any) {}
//
//   async handleConnection(socket: Socket) {
//     const token =
//       socket.handshake.headers.authorization?.split(' ')[1] ||
//       socket.handshake.auth.token;
//
//     if (!token) {
//       socket.emit('error', 'Token not present!');
//       return socket.disconnect();
//     }
//
//     let payload;
//     try {
//       payload = await this.jwtService.verifyAsync(token);
//     } catch {
//       socket.emit('error', 'Invalid token!');
//       return socket.disconnect();
//     }
//
//     const user = await this.userService.userModel.findById(payload.sub);
//
//     if (!user) {
//       socket.emit('error', 'User does not exist!');
//       return socket.disconnect();
//     }
//
//     if (!user.email.verified) {
//       socket.emit('error', "User's email is not verified!");
//       return socket.disconnect();
//     }
//
//     socket.data.user = { id: user.id };
//
//     await socket.join(user.id);
//
//     this.logger.verbose('Client connected.', socket.id);
//   }
//
//   handleDisconnect(socket: Socket) {
//     // TODO: mark user as offline
//     this.logger.verbose('Client disconnected', socket.id);
//   }
//
//   @OnEvent('notification.unread')
//   sendUnreadNotifications(payload: {
//     userId: string;
//     unreadNotifications: number;
//   }) {
//     this.server
//       .to(payload.userId)
//       .emit('notification-unread', payload.unreadNotifications);
//   }
