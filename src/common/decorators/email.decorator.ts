import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export function EmailValidator() {
  return applyDecorators(
    Transform((params) => {
      const value: string = params.value;

      const [local, domain] = value.split('@');

      // replace possible dots in the local-part of the email as some email providers treat them the same as others without
      return `${local.replaceAll('.', '')}@${domain}`.toLowerCase();
    }),
    IsEmail(),
  );
}
