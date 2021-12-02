import { Organization } from 'src/models/organization.model';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ITokenPayload } from 'src/interfaces/ITokenPayload';
import { User } from 'src/models/user.model';
import { CreateEventDTO } from '../../dto/createEvent.dto';
import { UpdateEventDTO } from '../../dto/updateEvent.dto';
import { GenerateResponse } from '../../helpers/generateResponse';
import { IEventsResponse } from '../../interfaces/Response/IEventsResponse';
import { Event } from '../../models/event.model';
import { eventsServiceMock } from '../../__mock__/events-service.mock';

@Injectable()
export class EventsService {
    constructor(
        @InjectModel(Event) private eventRepository: typeof Event,
        @InjectModel(User) private userRepository: typeof User,
    ) {}

    async getEventById(id: number): Promise<GenerateResponse<IEventsResponse<Event>>> {
        const events = await this.eventRepository.findByPk(id, {
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
        if (events)
            return new GenerateResponse<IEventsResponse<Event>>({
                data: { events },
            });
        else
            return new GenerateResponse<null>({
                status: HttpStatus.NOT_FOUND,
                error: true,
                message: eventsServiceMock.EVENT_NOT_FOUND,
                data: null,
            });
    }

    async getAllEvents(): Promise<GenerateResponse<IEventsResponse<Event[]>>> {
        const events = await this.eventRepository.findAll();
        if (events.length)
            return new GenerateResponse<IEventsResponse<Event[]>>({
                data: { events },
            });
        else
            return new GenerateResponse<null>({
                status: HttpStatus.NOT_FOUND,
                error: true,
                message: eventsServiceMock.EVENT_NOT_FOUND,
                data: null,
            });
    }

    async getEventsFromPage(
        page: number,
    ): Promise<GenerateResponse<IEventsResponse<{ rows: Event[]; count: number }>>> {
        const limit = Number(process.env.EVENT_PAGE_LIMIT);
        const offset = limit * page;
        const events = await this.eventRepository.findAndCountAll({ limit, offset, order: [['id', 'DESC']] });
        if (events.rows.length)
            return new GenerateResponse<IEventsResponse<{ rows: Event[]; count: number }>>({
                data: { events },
            });
        else
            return new GenerateResponse<null>({
                status: HttpStatus.NOT_FOUND,
                error: true,
                message: eventsServiceMock.EVENT_NOT_FOUND,
                data: null,
            });
    }

    async getEventsLastLimited(limit: number): Promise<GenerateResponse<IEventsResponse<Event[]>>> {
        const events = await this.eventRepository.findAll({ limit, order: [['id', 'DESC']] });
        if (events.length)
            return new GenerateResponse<IEventsResponse<Event[]>>({
                data: { events },
            });
        else
            return new GenerateResponse<null>({
                status: HttpStatus.NOT_FOUND,
                error: true,
                message: eventsServiceMock.EVENT_NOT_FOUND,
                data: null,
            });
    }

    async createEvent(dto: CreateEventDTO, organization: ITokenPayload): Promise<GenerateResponse<null>> {
        const event = await this.eventRepository.create({ ...dto, organizationId: organization.id });
        if (event)
            return new GenerateResponse<null>({
                message: eventsServiceMock.SUCCESSFUL_CREATED,
                data: null,
            });
        else
            return new GenerateResponse<null>({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: eventsServiceMock.UNSUCCESSFUL_CREATED,
                data: null,
            });
    }

    async updateEvent(
        { id, title, description, date, location }: UpdateEventDTO,
        organization: ITokenPayload,
    ): Promise<GenerateResponse<null>> {
        const event = await this.eventRepository.update(
            { title, description, date, location },
            { where: { id, organizationId: organization.id } },
        );
        if (event)
            return new GenerateResponse<null>({
                message: eventsServiceMock.SUCCESSFUL_UPDATED,
                data: null,
            });
        else
            return new GenerateResponse<null>({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: eventsServiceMock.UNSUCCESSFUL_UPDATED,
                data: null,
            });
    }

    async deleteEvent(id: number, organization: ITokenPayload): Promise<GenerateResponse<null>> {
        const result = await this.eventRepository.destroy({ where: { id, organizationId: organization.id } });
        if (result > 0)
            return new GenerateResponse<null>({
                message: eventsServiceMock.SUCCESSFUL_DELETED,
                data: null,
            });
        else
            return new GenerateResponse<null>({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: eventsServiceMock.UNSUCCESSFUL_DELETED,
                data: null,
            });
    }

    async followEvent(eventId: number, user: ITokenPayload) {
        if (!user) {
            return new GenerateResponse<null>({
                status: HttpStatus.UNAUTHORIZED,
                error: true,
                message: eventsServiceMock.WRONG_TOKEN,
                data: null,
            });
        }

        const result = await this.getEventById(eventId);
        if (result.error) return result;

        const candidate = await this.userRepository.findByPk(user.id, { include: { all: true } });
        if (!candidate) {
            return new GenerateResponse<null>({
                status: HttpStatus.UNAUTHORIZED,
                error: true,
                message: eventsServiceMock.WRONG_TOKEN,
                data: null,
            });
        }
        const userHasEvent = await candidate.$has('followedEvents', eventId);
        if (!userHasEvent) {
            const countEvents = await candidate.$count('followedEvents');
            if (countEvents <= 0) {
                await candidate.$set('followedEvents', [eventId]);
                return new GenerateResponse<null>({
                    message: eventsServiceMock.SUCCESSFUL_FOLLOW,
                    data: null,
                });
            } else {
                await candidate.$add('followedEvents', eventId);
                return new GenerateResponse<null>({
                    message: eventsServiceMock.SUCCESSFUL_FOLLOW,
                    data: null,
                });
            }
        } else {
            return new GenerateResponse<null>({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: eventsServiceMock.ALREADY_FOLLOW,
                data: null,
            });
        }
    }

    async unfollowEvent(eventId: number, user: ITokenPayload) {
        if (!user) {
            return new GenerateResponse<null>({
                status: HttpStatus.UNAUTHORIZED,
                error: true,
                message: eventsServiceMock.WRONG_TOKEN,
                data: null,
            });
        }

        const result = await this.getEventById(eventId);
        if (result.error) return result;

        const candidate = await this.userRepository.findByPk(user.id, { include: { all: true } });
        const userHasEvent = await candidate.$has('followedEvents', eventId);
        if (userHasEvent) {
            const count = await candidate.$remove('followedEvents', eventId);
            if (count > 0) {
                return new GenerateResponse<null>({
                    message: eventsServiceMock.SUCCESSFUL_UNFOLLOW,
                    data: null,
                });
            } else {
                return new GenerateResponse<null>({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: true,
                    message: eventsServiceMock.SERVER_ERROR,
                    data: null,
                });
            }
        } else {
            return new GenerateResponse<null>({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: eventsServiceMock.WRONG_DATA,
                data: null,
            });
        }
    }
}
