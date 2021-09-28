import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TokenDecorator = createParamDecorator((_, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest().headers['authorization']?.split(' ')[1];
});
