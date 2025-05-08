import { Logger, OnApplicationShutdown } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { Subscription } from 'rxjs';
import { SocketsService } from './sockets.service';
import { DefaultEventsMap, Server, Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Types } from 'mongoose';

export interface SocketData {
  user: { id: Types.ObjectId };
}

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketsGateway
  implements
    OnGatewayInit<Server>,
    OnGatewayConnection<Socket>,
    OnGatewayDisconnect<Socket>,
    OnApplicationShutdown
{
  private readonly subscription: Subscription;
  private readonly logger = new Logger(SocketsGateway.name);

  constructor(
    private readonly socketsService: SocketsService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  afterInit(
    server: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  ) {
    this.socketsService.getSubject$().subscribe({
      next(event) {
        const { room, name, data } = event;

        if (room) server.to(room).emit(name, data);
        else server.emit(name, data);
      },

      error(err) {
        server.emit('exception', err);
      },
    });
  }

  async handleConnection(
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    ...args: any[]
  ) {
    this.logger.debug('args', args);

    function disconnect(message: string) {
      socket.disconnect();
      throw new WsException({ message });
    }

    const token =
      socket.handshake.headers.authorization?.split(' ')[1] ||
      (socket.handshake.auth.token as string);

    if (!token) disconnect('Token not present!');

    let payload: { sub: string } = { sub: '' };
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch {
      disconnect('Token invalid!');
    }

    const user = await this.userService.userModel.findById(payload.sub);

    if (!user) return disconnect('User does not exist!');

    if (!user.email.verified) disconnect("User's email is not verified!");

    socket.data.user = { id: user._id };

    await socket.join(user.id);

    socket.onAny((event, data) =>
      this.eventEmitter.emit(event, socket.data, data),
    );

    this.logger.verbose('Client connected.', {
      user: user.id,
      socket: socket.id,
    });
  }

  async handleDisconnect(
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  ) {
    // TODO: mark user as offline
    this.logger.verbose('Client disconnected', {
      user: socket.data.user?.id,
      socket: socket.id,
    });
  }

  onApplicationShutdown() {
    this.subscription.unsubscribe();
  }
}
