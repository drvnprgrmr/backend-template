import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { preSave } from './schemas/middleware';
import { userMethods } from './schemas/methods';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory() {
          const schema = UserSchema;

          for (const method of userMethods) schema.method(method.name, method);

          schema.pre('save', preSave);

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
