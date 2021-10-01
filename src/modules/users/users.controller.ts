import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('/:id')
    async getUserById(@Param('id') id: string, @Res() res: Response) {
        const result = await this.usersService.getUserById(Number(id));
        res.status(result.status).send(result);
    }

    @Post('/email')
    async getUserByEmail(@Body() { email }: { email: string }, @Res() res: Response) {
        const result = await this.usersService.getUserByEmail(email);
        res.status(result.status).send(result);
    }
}
