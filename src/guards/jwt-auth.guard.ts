import { ITokenPayload } from '../interfaces/ITokenPayload';
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.header.authorization;
        const bearer = authHeader.split(' ')[0];
        const token = authHeader.split(' ')[1];

        if (bearer !== 'Bearer' || !token)
            throw new UnauthorizedException({ message: 'Пользователь не авторизирован' });

        const user: ITokenPayload = this.jwtService.verify(token);
        req.user = user;
        return Boolean(user);
    }
}
