import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TYPES_KEY } from 'src/decorators/jwt-type.decorator';
import { ITokenPayload } from '../interfaces/ITokenPayload';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector) {}

    async canActivate(context: ExecutionContext) {
        const requiredTypes = this.reflector.getAllAndOverride(TYPES_KEY, [context.getHandler(), context.getClass()]);
        const req = await context.switchToHttp().getRequest();
        const authHeader = req.headers.authorization;
        if (!authHeader) return false;
        const bearer = authHeader.split(' ')[0];
        const token = authHeader.split(' ')[1];

        if (bearer !== 'Bearer' || !token) return false;

        const tokenData: ITokenPayload = await this.jwtService.verify(token);
        req.tokenData = tokenData;
        if (!requiredTypes) {
            return Boolean(tokenData);
        } else {
            return Boolean(requiredTypes.includes(tokenData.type));
        }
    }
}
