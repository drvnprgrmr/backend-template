import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';
import * as crypto from 'node:crypto';

import { User } from './schemas/user.schema';
import { UserMethods } from './schemas/methods';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AwsS3Service } from 'src/common/services';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    readonly userModel: Model<User, object, UserMethods>,
    private readonly jwtService: JwtService,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async signup(dto: SignupDto) {
    let user = await this.userModel
      .findOne({
        $or: [
          { username: dto.username },
          { 'email.value': dto['email.value'] },
        ],
      })
      .exec();

    if (user) throw new BadRequestException('User already exists!');

    user = await this.userModel.create(dto);

    const token = await this.jwtService.signAsync({ sub: user.id });

    return { message: 'User signup successful!', data: { user, token } };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel
      .findOne({ 'email.value': dto.email })
      .exec();

    if (!user || !(await user.verifyHash('password', dto.password)))
      throw new BadRequestException('Invalid credentials!');

    const token = await this.jwtService.signAsync({ sub: user.id });

    return { message: 'User login successful!', data: { user, token } };
  }

  async upload(userId: Types.ObjectId, files: Express.Multer.File[]) {
    if (files.length === 0)
      throw new BadRequestException('No files were sent.');

    const urls: string[] = [];

    for (const file of files) {
      const key = crypto.randomUUID().toString();

      const url = await this.awsS3Service.uploadFile(
        {
          key,
          path: file.path,
          length: file.size,
          mimetype: file.mimetype,
          metadata: { userId: userId.toString() },
        },
        false,
      );

      urls.push(url);
    }

    return { message: 'Files Uploaded Successful!', data: { urls } };
  }
}
