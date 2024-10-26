import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { preSave, preValidate } from './schemas/middleware';
import { userMethods } from './schemas/methods';
import { UserController } from './user.controller';
import { MulterModule } from '@nestjs/platform-express';
import { TMP_DIR } from 'src/config';
import { SendgridEmailModule } from 'src/sendgrid/sendgrid-email/sendgrid-email.module';
import { AwsModule } from 'src/aws/aws.module';
import { Follow, FollowSchema } from './schemas/follow.schema';

@Module({
  imports: [
    SendgridEmailModule,
    AwsModule,
    MulterModule.register({
      dest: TMP_DIR,
      limits: { fileSize: 25 * 1_000_000, files: 5 },
    }),
    MongooseModule.forFeatureAsync([
      {
        name: Follow.name,
        useFactory() {
          const schema = FollowSchema;

          return schema;
        },
      },
      {
        name: User.name,
        useFactory() {
          const schema = UserSchema;

          for (const method of userMethods) schema.method(method.name, method);

          schema.virtual('fullName').get(function () {
            return `${this.name.first ?? ''} ${this.name.last ?? ''}`.trim();
          });

          schema.pre('save', preSave);
          schema.pre('validate', preValidate);

          schema.index(
            { createdAt: -1 },
            {
              expires: '30d',
              partialFilterExpression: { 'email.verified': false },
            },
          );

          return schema;
        },
      },
    ]),
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
