import { HttpException, HttpStatus } from '@nestjs/common';

export class PathAlreadyExistsException extends HttpException {
  constructor() {
    super(
      { code: '11001', message: 'Path already exists!' },
      HttpStatus.BAD_REQUEST,
    );
  }
}
