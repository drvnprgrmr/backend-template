import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Config, configuration, validateEnv } from './config';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { NotificationModule } from './notification/notification.module';
import { ChatModule } from './chat/chat.module';
// import { AppGateway } from './app/app.gateway';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BlogModule } from './blog/blog.module';
import { SocketsModule } from './sockets/sockets.module';
import { AwsCloudfrontModule } from './aws/aws-cloudfront/aws-cloudfront.module';
import { AwsS3Module } from './aws/aws-s3/aws-s3.module';
import { SendgridEmailModule } from './sendgrid/sendgrid-email/sendgrid-email.module';
import { FirebaseMessagingModule } from './firebase/firebase-messaging/firebase-messaging.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: ':',
      verboseMemoryLeak: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        { name: 'l0', limit: 4, ttl: 60 * 1_000 },
        { name: 'l1', limit: 10, ttl: 10 * 60 * 1_000 },
        { name: 'l2', limit: 20, ttl: 60 * 60 * 1_000 },
      ],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService<Config, true>) {
        const mongoConfig = configService.get('mongo', { infer: true });
        return { uri: mongoConfig.uri };
      },
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService<Config, true>) {
        const jwtConfig = configService.get('jwt', { infer: true });

        return {
          secret: jwtConfig.secret,

          signOptions: {
            issuer: jwtConfig.issuer,
            audience: jwtConfig.audience,
            expiresIn: jwtConfig.expiresIn,
          },

          verifyOptions: {
            issuer: jwtConfig.issuer,
            audience: jwtConfig.audience,
          },
        };
      },
      global: true,
    }),
    ConfigModule.forRoot({
      load: [configuration],
      validate: validateEnv,
      isGlobal: true,
      cache: true,
    }),
    UserModule,
    NotificationModule,
    ChatModule,
    BlogModule,
    SocketsModule,
    AwsCloudfrontModule,
    AwsS3Module,
    SendgridEmailModule,
    FirebaseMessagingModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
