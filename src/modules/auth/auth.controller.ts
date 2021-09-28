import { Body, Controller, Post } from '@nestjs/common';
import { LoginDTO } from '../../dto/login.dto';
import { RegistrationDTO } from '../../dto/registration.dto';
import { AuthService } from './auth.service';

@Controller('/api/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/login')
    async login(@Body() dto: LoginDTO) {
        return await this.authService.login(dto);
    }

    @Post('/registration')
    async registration(@Body() dto: RegistrationDTO) {
        return await this.authService.registration(dto);
    }
}
