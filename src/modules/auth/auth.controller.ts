import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { OrgRegistrationDTO } from 'src/dto/orgRegistration.dto';
import { LoginDTO } from '../../dto/login.dto';
import { UserRegistrationDTO } from '../../dto/userRegistration.dto';
import { AuthService } from './auth.service';

@Controller('/api/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/login')
    async login(@Body() dto: LoginDTO, @Res() res: Response) {
        const result = await this.authService.login(dto);
        if (!result.error) res.cookie('AT', result.data.token);
        return res.status(result.status).send(result);
    }

    @Post('/org_login')
    async orgLogin(@Body() dto: LoginDTO, @Res() res: Response) {
        const result = await this.authService.organizationLogin(dto);
        if (!result.error) res.cookie('AT', result.data.token);
        return res.status(result.status).send(result);
    }

    @Post('/registration')
    async userRegistration(@Body() dto: UserRegistrationDTO, @Res() res: Response) {
        const result = await this.authService.userRegistration(dto);
        if (!result.error) res.cookie('AT', result.data.token);
        return res.status(result.status).send(result);
    }

    @Post('/org_registration')
    async orgRegistration(@Body() dto: OrgRegistrationDTO, @Res() res: Response) {
        const result = await this.authService.organizationRegistration(dto);
        if (!result.error) res.cookie('AT', result.data.token);
        return res.status(result.status).send(result);
    }
}
