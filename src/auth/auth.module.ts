import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Config } from 'src/config';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Config, true>) => {
        const jwtConfig = configService.get('jwt', { infer: true });

        return {
          secret: jwtConfig.secret,

          signOptions: {
            issuer: jwtConfig.issuer,
            audience: jwtConfig.audience,
            expiresIn: jwtConfig.expiresIn,
          },

          verifyOptions: {
            issuer: jwtConfig.issuer,
            audience: jwtConfig.audience,
          },
        };
      },
    }),
  ],
  providers: [AuthService],
})
export class AuthModule {}
