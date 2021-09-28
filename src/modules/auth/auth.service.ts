import { ITokenPayload } from '../../interfaces/ITokenPayload';
import { LoginDTO } from '../../dto/login.dto';
import { UsersService } from '../users/users.service';
import { RegistrationDTO } from '../../dto/registration.dto';
import { User } from '../../models/user.model';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async registration(dto: RegistrationDTO) {
        const IsValid = await this.usersService.validateNewUser(dto.email);
        if (!IsValid)
            throw new HttpException('Пользователь с такое почтой уже зарегистрирован', HttpStatus.BAD_REQUEST);
        const user = await this.usersService.createUser({ ...dto, password: await hash(dto.password, 10) });
        return this.generateToken(user);
    }

    async login(dto: LoginDTO) {
        const user = await this.usersService.validateUser(dto);
        return this.generateToken(user);
    }

    async generateToken(user: User) {
        const payload: ITokenPayload = { email: user.email, id: user.id, role: user.role };
        return {
            token: this.jwtService.sign(payload),
        };
    }
}
