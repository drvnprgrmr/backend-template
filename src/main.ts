import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Config } from './config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<Config, true>);

  const port = configService.get('port', { infer: true });
  const cors = configService.get('cors', { infer: true });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({ origin: cors.origin });

  await app.listen(port, () => {
    console.log(`Api is listening on port ${port}.`);
  });
}
bootstrap();
