import { Organization } from 'src/models/organization.model';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ITokenPayload } from 'src/interfaces/ITokenPayload';
import { User } from 'src/models/user.model';
import { CreateEventDTO } from '../../dto/createEvent.dto';
import { UpdateEventDTO } from '../../dto/updateEvent.dto';
import { GenerateResponse } from '../../helpers/generateResponse';
import { IEventsResponse } from '../../interfaces/Response/IEventsResponse';
import { IResponse } from '../../interfaces/Response/IResponse';
import { Event } from '../../models/event.model';

const SUCCESSFUL_CREATED = 'Занятие было создано';
const UNSUCCESSFUL_CREATED = 'Занятие не было создано';
const SUCCESSFUL_UPDATED = 'Занятие было обновлено';
const UNSUCCESSFUL_UPDATED = 'Занятие не было обновлено';
const SUCCESSFUL_DELETED = 'Занятие было удалено';
const UNSUCCESSFUL_DELETED = 'Занятие не было удалено';
const EVENT_NOT_FOUND = 'Занятие не найдено';
const SUCCESSFUL_FOLLOW = 'Вы были записаны на мероприятие';
const ALREADY_FOLLOW = 'Вы уже записанны за мероприятие';
const SUCCESSFUL_UNFOLLOW = 'Вы больше не записанны на мероприятие';
const WRONG_DATA = 'Неверные данные';
const WRONG_TOKEN = 'Неверный токен';
const SERVER_ERROR = 'Ошибка сервера';

@Injectable()
export class EventsService {
    constructor(
        @InjectModel(Event) private eventRepository: typeof Event,
        @InjectModel(User) private userRepository: typeof User,
    ) {}

    async getEventById(id: number): Promise<IResponse<IEventsResponse<Event>>> {
        const event = await this.eventRepository.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    association: 'followingUsers',
                    attributes: ['id', 'nickName', 'firstName', 'lastName'],
                },
                {
                    model: Organization,
                    as: 'organization',
                    association: 'organization',
                    attributes: ['id', 'name'],
                },
            ],
        });
        if (event)
            return new GenerateResponse({
                data: { event },
            }) as IResponse<IEventsResponse<Event>>;
        else
            return new GenerateResponse({
                status: HttpStatus.NOT_FOUND,
                error: true,
                message: EVENT_NOT_FOUND,
                data: null,
            }) as IResponse<null>;
    }

    async getAllEvents(): Promise<IResponse<IEventsResponse<Event[]>>> {
        const events = await this.eventRepository.findAll();
        if (events.length)
            return new GenerateResponse({
                data: { events },
            }) as IResponse<IEventsResponse<Event[]>>;
        else
            return new GenerateResponse({
                status: HttpStatus.NOT_FOUND,
                error: true,
                message: EVENT_NOT_FOUND,
                data: null,
            }) as IResponse<null>;
    }

    async getEventsFromPage(page: number): Promise<IResponse<IEventsResponse<{ rows: Event[]; count: number }>>> {
        const limit = Number(process.env.EVENT_PAGE_LIMIT);
        const offset = limit * page;
        const events = await this.eventRepository.findAndCountAll({ limit, offset, order: [['id', 'DESC']] });
        if (events.rows.length)
            return new GenerateResponse({
                data: { ...events },
            }) as IResponse<IEventsResponse<{ rows: Event[]; count: number }>>;
        else
            return new GenerateResponse({
                status: HttpStatus.NOT_FOUND,
                error: true,
                message: EVENT_NOT_FOUND,
                data: null,
            }) as IResponse<null>;
    }

    async getEventsLastLimited(limit: number): Promise<IResponse<IEventsResponse<Event[]>>> {
        const events = await this.eventRepository.findAll({ limit, order: [['id', 'DESC']] });
        if (events.length)
            return new GenerateResponse({
                data: { events },
            }) as IResponse<IEventsResponse<Event[]>>;
        else
            return new GenerateResponse({
                status: HttpStatus.NOT_FOUND,
                error: true,
                message: EVENT_NOT_FOUND,
                data: null,
            }) as IResponse<null>;
    }

    async createEvent(dto: CreateEventDTO, organization: ITokenPayload): Promise<IResponse<null>> {
        const event = await this.eventRepository.create({ ...dto, organizationId: organization.id });
        if (event)
            return new GenerateResponse({
                message: SUCCESSFUL_CREATED,
                data: null,
            }) as IResponse<null>;
        else
            return new GenerateResponse({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: UNSUCCESSFUL_CREATED,
                data: null,
            }) as IResponse<null>;
    }

    async updateEvent(
        { id, title, description, date, location }: UpdateEventDTO,
        organization: ITokenPayload,
    ): Promise<IResponse<null>> {
        const event = await this.eventRepository.update(
            { title, description, date, location },
            { where: { id, organizationId: organization.id } },
        );
        if (event)
            return new GenerateResponse({
                message: SUCCESSFUL_UPDATED,
                data: null,
            }) as IResponse<null>;
        else
            return new GenerateResponse({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: UNSUCCESSFUL_UPDATED,
                data: null,
            }) as IResponse<null>;
    }

    async deleteEvent(id: number, organization: ITokenPayload): Promise<IResponse<null>> {
        const result = await this.eventRepository.destroy({ where: { id, organizationId: organization.id } });
        if (result > 0)
            return new GenerateResponse({
                message: SUCCESSFUL_DELETED,
                data: null,
            }) as IResponse<null>;
        else
            return new GenerateResponse({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: UNSUCCESSFUL_DELETED,
                data: null,
            }) as IResponse<null>;
    }

    async followEvent(eventId: number, user: ITokenPayload) {
        if (!user) {
            return new GenerateResponse({
                status: HttpStatus.UNAUTHORIZED,
                error: true,
                message: WRONG_TOKEN,
                data: null,
            }) as IResponse<null>;
        }

        const result = await this.getEventById(eventId);
        if (result.error) return result;

        const candidate = await this.userRepository.findByPk(user.id, { include: { all: true } });
        if (!candidate) {
            return new GenerateResponse({
                status: HttpStatus.UNAUTHORIZED,
                error: true,
                message: WRONG_TOKEN,
                data: null,
            }) as IResponse<null>;
        }
        const userHasEvent = await candidate.$has('followedEvents', eventId);
        if (!userHasEvent) {
            const countEvents = await candidate.$count('followedEvents');
            if (countEvents <= 0) {
                await candidate.$set('followedEvents', [eventId]);
                return new GenerateResponse({
                    message: SUCCESSFUL_FOLLOW,
                    data: null,
                }) as IResponse<null>;
            } else {
                await candidate.$add('followedEvents', eventId);
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

    async unfollowEvent(eventId: number, user: ITokenPayload) {
        if (!user) {
            return new GenerateResponse({
                status: HttpStatus.UNAUTHORIZED,
                error: true,
                message: WRONG_TOKEN,
                data: null,
            }) as IResponse<null>;
        }

        const result = await this.getEventById(eventId);
        if (result.error) return result;

        const candidate = await this.userRepository.findByPk(user.id, { include: { all: true } });
        const userHasEvent = await candidate.$has('followedEvents', eventId);
        if (userHasEvent) {
            const count = await candidate.$remove('followedEvents', eventId);
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
