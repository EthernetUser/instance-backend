import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService, JwtModule],
    imports: [
        forwardRef(() => UsersModule),
        forwardRef(() =>
            JwtModule.register({
                secret: `${process.env.SECRET_KEY}` || 'verysypadypasecretKEEYYYy',
                signOptions: {
                    expiresIn: process.env.TOKEN_EXPIRES_IN || '24h',
                },
            }),
        ),
    ],
    exports: [AuthService, JwtModule],
})
export class AuthModule {}
