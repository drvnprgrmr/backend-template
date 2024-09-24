import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor() {
    super({ code: '100', message: 'User not found!' }, HttpStatus.NOT_FOUND);
  }
}
