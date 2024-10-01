import { Module } from '@nestjs/common';
import { SocketsService } from './sockets.service';
import { SocketsGateway } from './sockets.gateway';

@Module({
  providers: [SocketsService, SocketsGateway]
})
export class SocketsModule {}
