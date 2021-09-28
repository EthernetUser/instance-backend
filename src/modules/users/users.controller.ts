import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('/:id')
    async getUserById(@Param('id') id: string) {
        const num_id = +id;
        return this.usersService.getUserById(num_id);
    }

    @Post('/email')
    async getUserByEmail(@Body() { email }) {
        return this.usersService.getUserByEmail(email);
    }
}
