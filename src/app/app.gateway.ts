// import { Logger } from '@nestjs/common';
// import { OnEvent } from '@nestjs/event-emitter';
// import { JwtService } from '@nestjs/jwt';
// import {
//   ConnectedSocket,
//   MessageBody,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { ChatService } from 'src/chat/chat.service';
// import { UserService } from 'src/user/user.service';
// 
// @WebSocketGateway()
// export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer()
//   private readonly server: Server;
// 
//   private readonly logger: Logger = new Logger(AppGateway.name);
// 
//   constructor(
//     private readonly chatService: ChatService,
//     private readonly userService: UserService,
//     private readonly jwtService: JwtService,
//   ) {}
// 
//   // todo: online status
//   // todo: chat presence indicator
// 
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
//   @OnEvent('hello')
//   sendHello(payload: any) {
//     this.server.emit('hello', payload);
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
// }
