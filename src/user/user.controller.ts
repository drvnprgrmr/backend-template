import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UserGuard, UserPopulatedRequest } from './user.guard';
import { Types } from 'mongoose';
import { ObjectId } from 'src/common/decorators';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { FollowUserDto } from './dto/follow-user.dto';
import { GetFollows } from './dto/get-follows.dto';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(@Query() query: GetUsersDto) {
    return this.userService.getUsers(query);
  }

  @UseGuards(ThrottlerGuard)
  @Post('/signup')
  signup(@Body() body: SignupDto) {
    return this.userService.signup(body);
  }

  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  login(@Body() body: LoginDto) {
    return this.userService.login(body);
  }

  @UseGuards(UserGuard)
  @Get('/me')
  getUserProfile(@Req() req: UserPopulatedRequest) {
    return this.userService.getUserProfile(req.user.id);
  }

  @UseGuards(UserGuard)
  @Patch('/me')
  updateUser(@Req() req: UserPopulatedRequest, @Body() body: UpdateUserDto) {
    return this.userService.updateUser(req.user.id, body);
  }

  @UseGuards(ThrottlerGuard)
  @Get('/otp')
  sendOtp(@Query() query: SendOtpDto) {
    return this.userService.sendOtp(query);
  }

  @UseGuards(ThrottlerGuard)
  @Get('/verify-email')
  verifyEmail(@Query() query: VerifyEmailDto) {
    return this.userService.verifyEmail(query);
  }

  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(UserGuard, ThrottlerGuard)
  @Post('/upload')
  upload(
    @Req() req: UserPopulatedRequest,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.userService.upload(req.user.id, files);
  }

  @UseGuards(UserGuard)
  @Post('/follow')
  followUser(@Req() req: UserPopulatedRequest, @Body() body: FollowUserDto) {
    return this.userService.followUser(req.user.id, body);
  }

  @UseGuards(UserGuard)
  @Delete('/follow')
  unfollowUser(@Req() req: UserPopulatedRequest, @Query() body: FollowUserDto) {
    return this.userService.unfollowUser(req.user.id, body);
  }

  @UseGuards(UserGuard)
  @Get('/follow')
  getFollows(@Req() req: UserPopulatedRequest, @Query() query: GetFollows) {
    return this.userService.getFollows(req.user.id, query);
  }

  @Get('/:id')
  getPublicProfile(@ObjectId() id: Types.ObjectId) {
    return this.userService.getPublicProfile(id);
  }
}
