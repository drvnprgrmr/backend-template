import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Controller('/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // warning: remove route in production
  @Post('/signup')
  signup(@Body() body: SignupDto) {
    return this.adminService.signup(body);
  }

  @Post('/login')
  login(@Body() body: LoginDto) {
    return this.adminService.login(body);
  }
}
