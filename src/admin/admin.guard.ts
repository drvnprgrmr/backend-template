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
import { isValidObjectId, Types } from 'mongoose';
import { AdminService } from './admin.service';

export type AdminPopulatedRequest = Request & { admin: { id: Types.ObjectId } };

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminService: AdminService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token)
      throw new BadRequestException({ message: 'Token not present!' });

    let payload: { sub: string; typ: string };
    try {
      payload = await this.jwtService.verifyAsync(token);

      if (!isValidObjectId(payload.sub) || payload.typ !== 'admin')
        throw new Error();
    } catch {
      throw new UnauthorizedException({ message: 'Invalid token!' });
    }

    const admin = await this.adminService.adminModel
      .findById(payload.sub)
      .select('_id')
      .lean()
      .exec();

    if (!admin) throw new NotFoundException({ message: 'Admin not found!' });

    request['admin'] = { id: admin._id };

    return true;
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
