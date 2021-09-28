import { LoginDTO } from '../../dto/login.dto';
import { RegistrationDTO } from '../../dto/registration.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../models/user.model';
import { HttpStatus, Injectable } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { GenerateResponse } from '../../helpers/generateResponse';
import { IResponse } from '../../interfaces/IResponse';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userRepository: typeof User) {}

    async createUser(dto: RegistrationDTO): Promise<User> {
        return await this.userRepository.create(dto);
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({ where: { email }, include: { all: true } });
        if (user)
            return new GenerateResponse({
                data: { user },
            }) as IResponse<{ user: User }>;
        else
            return new GenerateResponse({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: 'Пользователь не найден',
                data: null,
            }) as IResponse<null>;
    }

    async getUserById(id: number) {
        const user = await this.userRepository.findByPk(id, { include: { all: true } });
        if (user)
            return new GenerateResponse({
                data: { user },
            }) as IResponse<{ user: User }>;
        else
            return new GenerateResponse({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: 'Пользователь не найден',
                data: null,
            }) as IResponse<null>;
    }

    async validateNewUser(email: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ where: { email } });
        return !user;
    }

    async validateUser(dto: LoginDTO): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { email: dto.email } });
        const passwordEquals = await compare(dto.password, user.password);
        if (user && passwordEquals) return user;
        else return null;
    }
}
