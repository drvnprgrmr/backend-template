import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import helmet from 'helmet';

import { AppModule } from './app.module';
import { Config } from './config';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService<Config, true>);

  const port = configService.get('port', { infer: true });
  const cors = configService.get('cors', { infer: true });

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({ origin: cors.origin });

  app.set('trust proxy', 'loopback');

  await app.listen(port, () => {
    console.log(`Api is listening on port ${port}.`);
  });
}
bootstrap();
