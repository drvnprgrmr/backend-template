import {
  applyDecorators,
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { Request } from 'express';
import { isValidObjectId, Types } from 'mongoose';

export const ObjectId = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();

    const param = request.params[data || 'id'];

    if (!param) throw new BadRequestException(`Param not set!`);

    if (!isValidObjectId(param))
      throw new BadRequestException(`${param} is not a valid ObjectId.`);

    return new Types.ObjectId(param);
  },
);

export function ToObjectId() {
  return applyDecorators(
    Transform((params) => {
      const value: string = params.value;
      return new Types.ObjectId(value);
    }),
    IsMongoId(),
  );
}
