import { HttpException, HttpStatus } from '@nestjs/common';

const code = 10000;
const message = 'User not found!';
export class UserNotFoundException extends HttpException {
  constructor() {
    super({ code, message }, HttpStatus.NOT_FOUND);
  }

  static code = code;
  static msg = message;
}
