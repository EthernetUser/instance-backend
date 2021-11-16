import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { compare } from 'bcryptjs';
import { LoginDTO } from '../../dto/login.dto';
import { UserRegistrationDTO } from '../../dto/userRegistration.dto';
import { GenerateResponse } from '../../helpers/generateResponse';
import { IResponse } from '../../interfaces/Response/IResponse';
import { User } from '../../models/user.model';
import { IUsersResponse } from './../../interfaces/Response/IUsersResponse';

const USER_NOT_FOUND = 'Пользователь не найден';
@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userRepository: typeof User) {}

    async createUser(dto: UserRegistrationDTO): Promise<User> {
        return await this.userRepository.create(dto);
    }

    async getUserByEmail(email: string): Promise<IResponse<IUsersResponse<User>>> {
        const user = await this.userRepository.findOne({ where: { email }, include: { all: true } });
        if (user)
            return new GenerateResponse({
                data: { user },
            }) as IResponse<IUsersResponse<User>>;
        else
            return new GenerateResponse({
                status: HttpStatus.NOT_FOUND,
                error: true,
                message: USER_NOT_FOUND,
                data: null,
            }) as IResponse<null>;
    }

    async getUserById(id: number): Promise<IResponse<IUsersResponse<User>>> {
        const user = await this.userRepository.findByPk(id, { include: { all: true } });
        if (user)
            return new GenerateResponse({
                data: { user },
            }) as IResponse<IUsersResponse<User>>;
        else
            return new GenerateResponse({
                status: HttpStatus.NOT_FOUND,
                error: true,
                message: USER_NOT_FOUND,
                data: null,
            }) as IResponse<null>;
    }

    async validateNewUser(email: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ where: { email } });
        return !user;
    }

    async validateUser(dto: LoginDTO): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { email: dto.email } });
        if (!user) return null;
        const passwordEquals = await compare(dto.password, user.password);
        if (passwordEquals) return user;
        else return null;
    }
}
