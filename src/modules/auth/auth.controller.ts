import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoginDTO } from '../../dto/login.dto';
import { RegistrationDTO } from '../../dto/registration.dto';
import { AuthService } from './auth.service';

@Controller('/api/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/login')
    async login(@Body() dto: LoginDTO, @Res() res: Response) {
        const result = await this.authService.login(dto);
        res.status(result.status).send(result);
    }

    @Post('/registration')
    async user_registration(@Body() dto: RegistrationDTO, @Res() res: Response) {
        const result = await this.authService.registration(dto);
        res.status(result.status).send(result);
    }

    //TODO organization registration api
    @Post('/org_registration')
    async org_registration(@Body() dto: RegistrationDTO, @Res() res: Response) {
        const result = await this.authService.registration(dto);
        res.status(result.status).send(result);
    }
}
