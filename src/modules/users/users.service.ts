import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { compare } from 'bcryptjs';
import { LoginDTO } from '../../dto/login.dto';
import { RegistrationDTO } from '../../dto/registration.dto';
import { GenerateResponse } from '../../helpers/generateResponse';
import { IResponse } from '../../interfaces/Response/IResponse';
import { User } from '../../models/user.model';
import { ITokenPayload } from './../../interfaces/ITokenPayload';
import { IUsersResponse } from './../../interfaces/Response/IUsersResponse';
import { EventsService } from './../events/events.service';

const USER_NOT_FOUND = 'Пользователь не найден';
const WRONG_TOKEN = 'Неверный токен';
const SERVER_ERROR = 'Ошибка сервера';
const SUCCESSFUL_FOLLOW = 'Вы были записаны на мероприятие';
const ALREADY_FOLLOW = 'Вы уже записанны за мероприятие';
const SUCCESSFUL_UNFOLLOW = 'Вы больше не записанны на мероприятие';
const WRONG_DATA = 'Неверные данные';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private userRepository: typeof User,
        private jwtService: JwtService,
        private eventsService: EventsService,
    ) {}

    async createUser(dto: RegistrationDTO): Promise<User> {
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

    async followEvent(eventId: number, token: string) {
        if (!token) {
            return new GenerateResponse({
                status: HttpStatus.UNAUTHORIZED,
                error: true,
                message: WRONG_TOKEN,
                data: null,
            }) as IResponse<null>;
        }

        const result = await this.eventsService.getEventById(eventId);
        if (result.error) return result;

        const tokenPayload: ITokenPayload = await this.jwtService.verify(token);
        if (!tokenPayload) {
            return new GenerateResponse({
                status: HttpStatus.UNAUTHORIZED,
                error: true,
                message: WRONG_TOKEN,
                data: null,
            }) as IResponse<null>;
        }

        const user = await this.userRepository.findByPk(+tokenPayload.id, { include: { all: true } });
        const userHasEvent = await user.$has('followedEvents', eventId);
        if (!userHasEvent) {
            const countEvents = await user.$count('followedEvents');
            if (countEvents <= 0) {
                await user.$set('followedEvents', [eventId]);
                return new GenerateResponse({
                    message: SUCCESSFUL_FOLLOW,
                    data: null,
                }) as IResponse<null>;
            } else {
                await user.$add('followedEvents', eventId);
                return new GenerateResponse({
                    message: SUCCESSFUL_FOLLOW,
                    data: null,
                }) as IResponse<null>;
            }
        } else {
            return new GenerateResponse({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: ALREADY_FOLLOW,
                data: null,
            }) as IResponse<null>;
        }
    }

    async unfollowEvent(eventId: number, token: string) {
        if (!token) {
            return new GenerateResponse({
                status: HttpStatus.UNAUTHORIZED,
                error: true,
                message: WRONG_TOKEN,
                data: null,
            }) as IResponse<null>;
        }

        const result = await this.eventsService.getEventById(eventId);
        if (result.error) return result;

        const tokenPayload: ITokenPayload = await this.jwtService.verify(token);
        if (!tokenPayload) {
            return new GenerateResponse({
                status: HttpStatus.UNAUTHORIZED,
                error: true,
                message: WRONG_TOKEN,
                data: null,
            }) as IResponse<null>;
        }

        const user = await this.userRepository.findByPk(+tokenPayload.id, { include: { all: true } });
        const userHasEvent = await user.$has('followedEvents', eventId);
        if (userHasEvent) {
            const count = await user.$remove('followedEvents', eventId);
            if (count > 0) {
                return new GenerateResponse({
                    message: SUCCESSFUL_UNFOLLOW,
                    data: null,
                }) as IResponse<null>;
            } else {
                return new GenerateResponse({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: true,
                    message: SERVER_ERROR,
                    data: null,
                }) as IResponse<null>;
            }
        } else {
            return new GenerateResponse({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: WRONG_DATA,
                data: null,
            }) as IResponse<null>;
        }
    }
}
