import { ITokenPayload } from '../../interfaces/ITokenPayload';
import { LoginDTO } from '../../dto/login.dto';
import { UsersService } from '../users/users.service';
import { RegistrationDTO } from '../../dto/registration.dto';
import { User } from '../../models/user.model';
import { HttpStatus, Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { GenerateResponse } from '../../helpers/generateResponse';
import { IResponse } from '../../interfaces/IResponse';

const THIS_EMAIL_WAS_ALREADY_REGISTERED = 'Данная почта уже зарегистрирована';
const SUCCESSFUL_REGISTRATION = 'Вы были зарегистрированны';
const UNSUCCESSFUL_REGISTRATION = 'Ошибка регистрации';
const SUCCESSFUL_LOGIN = 'Вы вошли в аккаунт';
const UNSUCCESSFUL_LOGIN = 'Ошибка входа, данные не верны';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async registration(dto: RegistrationDTO) {
        const IsValid = await this.usersService.validateNewUser(dto.email);
        if (!IsValid)
            return new GenerateResponse({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: THIS_EMAIL_WAS_ALREADY_REGISTERED,
                data: null,
            }) as IResponse<null>;
        const user = await this.usersService.createUser({ ...dto, password: await hash(dto.password, 10) });
        if (user)
            return new GenerateResponse({
                message: SUCCESSFUL_REGISTRATION,
                data: await this.generateToken(user),
            }) as IResponse<{ token: string }>;
        else
            return new GenerateResponse({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: UNSUCCESSFUL_REGISTRATION,
                data: null,
            }) as IResponse<null>;
    }

    async login(dto: LoginDTO) {
        const user = await this.usersService.validateUser(dto);
        if (user)
            return new GenerateResponse({
                message: SUCCESSFUL_LOGIN,
                data: await this.generateToken(user),
            }) as IResponse<{ token: string }>;
        else
            return new GenerateResponse({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: UNSUCCESSFUL_LOGIN,
                data: null,
            }) as IResponse<null>;
    }

    async generateToken({ email, id, role }: User) {
        const payload: ITokenPayload = { email, id, role };
        return {
            token: await this.jwtService.sign(payload),
        };
    }
}
