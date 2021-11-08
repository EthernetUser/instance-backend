import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { Response } from 'express';
import { TokenDecorator } from 'src/decorators/token.decorator';
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
    async getUserByEmail(@Body('email') email: string, @Res() res: Response) {
        const result = await this.usersService.getUserByEmail(email);
        res.status(result.status).send(result);
    }

    @Put('/follow_event')
    async followEvent(@Body('eventId') eventId: number, @TokenDecorator() token: string, @Res() res: Response) {
        const result = await this.usersService.followEvent(eventId, token);
        res.status(result.status).send(result);
    }

    @Delete('/unfollow_event')
    async unfollowEvent(@Body('eventId') eventId: number, @TokenDecorator() token: string, @Res() res: Response) {
        const result = await this.usersService.unfollowEvent(eventId, token);
        res.status(result.status).send(result);
    }
}
