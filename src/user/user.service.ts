import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { FilterQuery, Model, Types } from 'mongoose';
import * as crypto from 'node:crypto';

import { User, UserVisibility } from './schemas/user.schema';
import { UserMethods } from './schemas/methods';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import {
  UserAlreadyExistsException,
  UserNotFoundException,
} from './exceptions';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { AwsS3Service } from 'src/aws/aws-s3/aws-s3.service';
import {
  SendgridEmailAddress,
  SendgridEmailService,
  SendgridEmailTemplate,
} from 'src/sendgrid/sendgrid-email/sendgrid-email.service';
import { FollowUserDto } from './dto/follow-user.dto';
import { FollowGroup, FollowType } from './schemas/follow-group.schema';
import { GetFollows } from './dto/get-follows.dto';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name)
    readonly userModel: Model<User, object, UserMethods, { fullName: string }>,
    @InjectModel(FollowGroup.name)
    readonly followGroupModel: Model<FollowGroup>,
    private readonly jwtService: JwtService,
    private readonly awsS3Service: AwsS3Service,
    private readonly sendgridEmailService: SendgridEmailService,
  ) {}

  // note: write admin module first
  async getAllUsers() {}

  async getUsers(dto: GetUsersDto) {
    const { q } = dto;

    const filter: FilterQuery<User> = { visibility: UserVisibility.PUBLIC };

    if (q) {
      filter.$or = [
        { username: { $regex: q, $options: 'i' } },
        { 'name.first': { $regex: q, $options: 'i' } },
        { 'name.last': { $regex: q, $options: 'i' } },
      ];
    }

    const users = await this.userModel
      .find(filter)
      .sort({ createdAt: 1 })
      .lean()
      .exec();

    return { message: 'Users fetched.', data: { users } };
  }

  async signup(dto: SignupDto) {
    let user = await this.userModel
      .findOne({
        $or: [
          { username: dto.username },
          { 'email.value': dto['email.value'] },
        ],
      })
      .exec();

    if (user) throw new UserAlreadyExistsException();

    user = await this.userModel.create(dto);

    const token = await this.jwtService.signAsync({
      sub: user.id,
      typ: 'user',
    });

    return { message: 'User signup successful!', data: { user, token } };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel
      .findOne({ 'email.value': dto.email })
      .exec();

    if (!user || !(await user.verifyHash('password', dto.password)))
      throw new BadRequestException({ message: 'Invalid credentials!' });

    const token = await this.jwtService.signAsync({
      sub: user.id,
      typ: 'user',
    });

    return { message: 'User login successful!', data: { user, token } };
  }

  async sendOtp(dto: SendOtpDto) {
    const { email } = dto;

    const user = await this.userModel.findOne({ 'email.value': email }).exec();

    if (!user) throw new UserNotFoundException();

    const otp = await user.generateNonce();

    await this.sendgridEmailService.sendFromTemplate({
      from: SendgridEmailAddress.TEST,
      to: email,
      templateId: SendgridEmailTemplate.TEST,
      dynamicTemplateData: { name: user.fullName || user.username, otp },
    });

    return { message: 'OTP sent!' };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const { email, otp } = dto;

    const user = await this.userModel.findOne({ 'email.value': email }).exec();

    if (!user) throw new UserNotFoundException();

    if (user.get('email.verified'))
      throw new BadRequestException({ message: 'Email already verified.' });

    const isValid = await user.verifyNonce(otp);

    if (isValid === 'expired')
      throw new BadRequestException({ message: 'OTP has expired.' });

    if (!isValid) throw new BadRequestException({ message: 'OTP is invalid' });

    user.set('email.verified', true);
    await user.save();

    return { message: 'Email verified!' };
  }

  async getUserProfile(userId: Types.ObjectId) {
    const user = await this.userModel
      .findById(userId)
      .select('-password')
      .lean()
      .exec();

    return { message: 'User profile fetched!', data: { user } };
  }

  async getPublicProfile(userId: Types.ObjectId) {
    const user = await this.userModel
      .findById(userId)
      .select('-password')
      .lean()
      .exec();

    if (!user) throw new UserNotFoundException();

    return { message: 'User data fetched!', data: { user } };
  }

  async updateUser(userId: Types.ObjectId, dto: UpdateUserDto) {
    if (
      dto['username'] &&
      (await this.userModel.findOne({ username: dto['username'] }).exec())
    )
      throw new UserAlreadyExistsException();

    const result = await this.userModel
      .updateOne({ _id: userId }, { $set: dto })
      .exec();

    if (result.matchedCount < 1) throw new UserNotFoundException();

    return { message: 'User updated!' };
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

  async deleteProfile(userId: Types.ObjectId, dto) {}

  async followUser(userId: Types.ObjectId, dto: FollowUserDto) {
    const { followingId } = dto;

    if (userId.equals(followingId))
      throw new BadRequestException('Cannot follow self.');

    const following = await this.userModel.findById(followingId).exec();
    if (!following) throw new UserNotFoundException();

    const doc = { follower: userId, following: followingId };

    if (await this.followGroupModel.findOne(doc).exec())
      throw new BadRequestException('This user is already being followed.');

    await this.userModel
      .updateOne({ _id: userId }, { $inc: { numFollowing: 1 } })
      .exec();

    await this.userModel
      .updateOne({ _id: followingId }, { $inc: { numFollowers: 1 } })
      .exec();

    await this.followGroupModel.create(doc);

    return { message: 'User has been followed.' };
  }

  async unfollowUser(userId: Types.ObjectId, dto: FollowUserDto) {
    const { followingId } = dto;

    const following = await this.userModel.findById(followingId).exec();
    if (!following) throw new UserNotFoundException();

    const doc = { follower: userId, following: followingId };

    if (!(await this.followGroupModel.findOne(doc).exec()))
      throw new BadRequestException('This user is not being followed.');

    await this.userModel
      .updateOne({ _id: userId }, { $inc: { numFollowing: -1 } })
      .exec();

    await this.userModel
      .updateOne({ _id: followingId }, { $inc: { numFollowers: -1 } })
      .exec();

    await this.followGroupModel.deleteOne(doc);

    return { message: 'User has been unfollowed.' };
  }

  async getFollows(userId: Types.ObjectId, dto: GetFollows) {
    const { type } = dto;

    const filter: FilterQuery<FollowGroup> = {};

    let message: string;

    if (type === FollowType.FOLLOWER) {
      filter[FollowType.FOLLOWING] = userId;
      message = "List of user's followers";
    } else if (type === FollowType.FOLLOWING) {
      filter[FollowType.FOLLOWER] = userId;
      message = 'List of following users';
    }

    const follows = await this.followGroupModel
      .find(filter)
      .select([type, '-_id', 'createdAt'])
      .populate(type, 'username name')
      .sort('-createdAt')
      .lean()
      .exec();

    return { message, data: { follows } };
  }
}
