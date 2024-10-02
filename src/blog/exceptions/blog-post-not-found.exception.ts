import { HttpException, HttpStatus } from '@nestjs/common';

export class BlogPostNotFoundException extends HttpException {
  constructor() {
    super(
      { code: '11000', message: 'Blog post not found!' },
      HttpStatus.NOT_FOUND,
    );
  }
}
