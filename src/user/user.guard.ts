import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from './user.service';
import { isValidObjectId, Types } from 'mongoose';

export type UserPopulatedRequest = Request & { user: { id: Types.ObjectId } };

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) throw new BadRequestException('Token not present!');

    let payload: { sub: string };
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Invalid token!');
    }

    if (!isValidObjectId(payload.sub))
      throw new UnauthorizedException('Invalid token!');

    const user = await this.userService.userModel
      .findById(payload.sub)
      .select('_id')
      .lean()
      .exec();

    if (!user) throw new NotFoundException('User not found!');

    request['user'] = { id: user._id };

    return true;
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
