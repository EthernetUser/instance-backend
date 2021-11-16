import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { TYPES } from 'src/decorators/jwt-type.decorator';
import { ITokenPayload } from 'src/interfaces/ITokenPayload';
import { CreateEventDTO } from '../../dto/createEvent.dto';
import { UpdateEventDTO } from '../../dto/updateEvent.dto';
import { EntityTypes } from './../../enums/entityTypes.enum';
import { JwtAuthGuard } from './../../guards/jwt-auth.guard';
import { EventsService } from './events.service';

@Controller('/api/event')
export class EventsController {
    constructor(private eventsService: EventsService) {}

    @Get('/:id')
    async getEvent(@Param('id') id: string, @Res() res: Response) {
        const result = await this.eventsService.getEventById(Number(id));
        return res.status(result.status).send(result);
    }

    @Get('/')
    async getAllEvent(@Res() res: Response) {
        const result = await this.eventsService.getAllEvents();
        return res.status(result.status).send(result);
    }

    @Get('/page/:page')
    async getEventFromPage(@Param('page') page: number, @Res() res: Response) {
        const result = await this.eventsService.getEventsFromPage(page);
        return res.status(result.status).send(result);
    }

    @Get('/limit/:limit')
    async getEventLastLimited(@Param('limit') limit: number, @Res() res: Response) {
        const result = await this.eventsService.getEventsLastLimited(Number(limit));
        return res.status(result.status).send(result);
    }

    @TYPES(EntityTypes.Organization)
    @UseGuards(JwtAuthGuard)
    @Post('/create')
    async createEvent(
        @Body() dto: CreateEventDTO,
        @Req() { tokenData }: { tokenData: ITokenPayload },
        @Res() res: Response,
    ) {
        const result = await this.eventsService.createEvent(dto, tokenData);
        return res.status(result.status).send(result);
    }

    @TYPES(EntityTypes.Organization)
    @UseGuards(JwtAuthGuard)
    @Put('/update')
    async updateEvent(
        @Body() dto: UpdateEventDTO,
        @Req() { tokenData }: { tokenData: ITokenPayload },
        @Res() res: Response,
    ) {
        const result = await this.eventsService.updateEvent(dto, tokenData);
        return res.status(result.status).send(result);
    }

    @TYPES(EntityTypes.Organization)
    @UseGuards(JwtAuthGuard)
    @Delete('/delete/:id')
    async deleteEvent(
        @Param('id') id: string,
        @Req() { tokenData }: { tokenData: ITokenPayload },
        @Res() res: Response,
    ) {
        const result = await this.eventsService.deleteEvent(Number(id), tokenData);
        return res.status(result.status).send(result);
    }

    @TYPES(EntityTypes.User)
    @UseGuards(JwtAuthGuard)
    @Put('/follow')
    async followEvent(
        @Body('eventId') eventId: number,
        @Req() { tokenData }: { tokenData: ITokenPayload },
        @Res() res: Response,
    ) {
        const result = await this.eventsService.followEvent(eventId, tokenData);
        return res.status(result.status).send(result);
    }

    @TYPES(EntityTypes.User)
    @UseGuards(JwtAuthGuard)
    @Delete('/unfollow')
    async unfollowEvent(
        @Body('eventId') eventId: number,
        @Req() { tokenData }: { tokenData: ITokenPayload },
        @Res() res: Response,
    ) {
        const result = await this.eventsService.unfollowEvent(eventId, tokenData);
        return res.status(result.status).send(result);
    }
}
