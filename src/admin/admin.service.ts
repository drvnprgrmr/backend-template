import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './schemas/admin.schema';
import { Model } from 'mongoose';
import { AdminMethods } from './schemas/methods';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from 'src/user/dto/signup.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name)
    readonly adminModel: Model<Admin, object, AdminMethods>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    if (await this.adminModel.findOne({ username: dto.username }).exec())
      throw new BadRequestException({ message: 'Admin already exists.' });

    const admin = await this.adminModel.create(dto);

    const token = await this.jwtService.signAsync({
      sub: admin.id,
      typ: 'admin',
    });

    return { message: 'Admin signup successful!', data: { admin, token } };
  }

  async login(dto: LoginDto) {
    const { username, password } = dto;

    const admin = await this.adminModel.findOne({ username }).exec();

    if (!admin || !(await admin.verifyHash('password', password)))
      throw new BadRequestException('Invalid credentials!');

    const token = await this.jwtService.signAsync({
      sub: admin.id,
      typ: 'admin',
    });

    return { message: 'Admin login successful!', data: { admin, token } };
  }
}
