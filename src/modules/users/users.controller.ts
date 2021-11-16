import { JwtAuthGuard } from './../../guards/jwt-auth.guard';
import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async getUserById(@Param('id') id: string, @Res() res: Response) {
        const result = await this.usersService.getUserById(Number(id));
        return res.status(result.status).send(result);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/email')
    async getUserByEmail(@Body('email') email: string, @Res() res: Response) {
        const result = await this.usersService.getUserByEmail(email);
        return res.status(result.status).send(result);
    }
}
