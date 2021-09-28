import { ITokenPayload } from '../../interfaces/ITokenPayload';
import { LoginDTO } from '../../dto/login.dto';
import { UsersService } from '../users/users.service';
import { RegistrationDTO } from '../../dto/registration.dto';
import { User } from '../../models/user.model';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { GenerateResponse } from '../../helpers/generateResponse';
import { IResponse } from '../../interfaces/IResponse';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async registration(dto: RegistrationDTO) {
        const IsValid = await this.usersService.validateNewUser(dto.email);
        if (!IsValid)
            throw new HttpException('Пользователь с такое почтой уже зарегистрирован', HttpStatus.BAD_REQUEST);
        const user = await this.usersService.createUser({ ...dto, password: await hash(dto.password, 10) });
        return new GenerateResponse({
            message: 'Вы были зарегистрированны',
            data: this.generateToken(user),
        }) as IResponse<{ token: string }>;
    }

    async login(dto: LoginDTO) {
        const user = await this.usersService.validateUser(dto);
        return new GenerateResponse({
            message: 'Вы вошли в аккаунт',
            data: this.generateToken(user),
        }) as IResponse<{ token: string }>;
    }

    async generateToken({ email, id, role }: User) {
        const payload: ITokenPayload = { email, id, role };
        return {
            token: this.jwtService.sign(payload),
        };
    }
}
