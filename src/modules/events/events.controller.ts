import { UpdateEventDTO } from '../../dto/updateEvent.dto';
import { CreateEventDTO } from '../../dto/createEvent.dto';
import { EventsService } from './events.service';
import { Controller, Post, Get, Param, Body, Put, Delete, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('/api/event')
export class EventsController {
    constructor(private eventsService: EventsService) {}

    @Get('/:id')
    async getEvent(@Param('id') id: string, @Res() res: Response) {
        const result = await this.eventsService.getEventById(Number(id));
        res.status(result.status).send(result);
    }

    @Get('/')
    async getAllEvent(@Res() res: Response) {
        const result = await this.eventsService.getAllEvents();
        res.status(result.status).send(result);
    }

    @Get('/page/:page')
    async getEventFromPage(@Param('page') page: number, @Res() res: Response) {
        const result = await this.eventsService.getEventsFromPage(page);
        res.status(result.status).send(result);
    }

    @Get('/limit/:limit')
    async getEventLastLimited(@Param('limit') limit: number, @Res() res: Response) {
        const result = await this.eventsService.getEventsLastLimited(Number(limit));
        res.status(result.status).send(result);
    }

    @Post('/create')
    async createEvent(@Body() dto: CreateEventDTO, @Res() res: Response) {
        const result = await this.eventsService.createEvent(dto);
        res.status(result.status).send(result);
    }

    @Put('/update')
    async updateEvent(@Body() dto: UpdateEventDTO, @Res() res: Response) {
        const result = await this.eventsService.updateEvent(dto);
        res.status(result.status).send(result);
    }

    @Delete('/delete/:id')
    async deleteEvent(@Param('id') id: string, @Res() res: Response) {
        const result = await this.eventsService.deleteEvent(Number(id));
        res.status(result.status).send(result);
    }
}
