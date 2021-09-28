import { LoginDTO } from '../../dto/login.dto';
import { RegistrationDTO } from '../../dto/registration.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../models/user.model';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare } from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userRepository: typeof User) {}

    async createUser(dto: RegistrationDTO): Promise<User> {
        return await this.userRepository.create(dto);
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { email }, include: { all: true } });
        if (user) return user;
        else throw new HttpException(`Пользователь с почтой '${email}' не найден`, HttpStatus.BAD_REQUEST);
    }

    async getUserById(id: number): Promise<User> {
        const user = await this.userRepository.findByPk(id, { include: { all: true } });
        if (user) return user;
        else throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST);
    }

    async validateNewUser(email: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ where: { email } });
        return !user;
    }

    async validateUser(dto: LoginDTO): Promise<User> | Promise<null> {
        const user = await this.getUserByEmail(dto.email);
        const passwordEquals = await compare(dto.password, user.password);
        if (user && passwordEquals) return user;
        else return null;
    }
}
