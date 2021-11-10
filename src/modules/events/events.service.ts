import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
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

@Injectable()
export class EventsService {
    constructor(@InjectModel(Event) private eventRepository: typeof Event) {}

    async getEventById(id: number): Promise<IResponse<IEventsResponse<Event>>> {
        const event = await this.eventRepository.findByPk(id, { include: { all: true } });
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

    async createEvent(dto: CreateEventDTO): Promise<IResponse<null>> {
        const event = await this.eventRepository.create(dto);
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

    async updateEvent({ id, title, description, date, location }: UpdateEventDTO): Promise<IResponse<null>> {
        const event = await this.eventRepository.update({ title, description, date, location }, { where: { id } });
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

    async deleteEvent(id: number): Promise<IResponse<null>> {
        const result = await this.eventRepository.destroy({ where: { id } });
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
}
