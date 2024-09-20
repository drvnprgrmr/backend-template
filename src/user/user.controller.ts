import {
  Body,
  Controller,
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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async signup(@Body() body: SignupDto) {
    return await this.userService.signup(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() body: LoginDto) {
    return await this.userService.login(body);
  }

  async getUserProfile() {}

  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(UserGuard, ThrottlerGuard)
  @Post('/upload')
  async upload(
    @Req() req: UserPopulatedRequest,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await this.userService.upload(req.user.id, files);
  }
}
