import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export function TitleValidator() {
  return applyDecorators(
    Transform((params) => {
      let value: string = params.value;

      value = value.trim();

      return value[0].toUpperCase() + value.slice(1).toLowerCase();
    }),
    IsString(),
    IsNotEmpty(),
  );
}
