import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
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

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // todo: protect with admin guard
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Post('/signup')
  signup(@Body() body: SignupDto) {
    return this.userService.signup(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  login(@Body() body: LoginDto) {
    return this.userService.login(body);
  }

  @Get('/:id')
  getPublicProfile(@ObjectId() id: Types.ObjectId) {
    return this.userService.getPublicProfile(id);
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
}
