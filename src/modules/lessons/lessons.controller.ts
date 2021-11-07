import { UpdateLessonDTO } from '../../dto/updateLesson.dto';
import { CreateLessonDTO } from '../../dto/createLesson.dto';
import { LessonsService } from './lessons.service';
import { Controller, Post, Get, Param, Body, Put, Delete, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('/api/lesson')
export class LessonsController {
    constructor(private lessonsService: LessonsService) {}

    @Get('/:id')
    async getLesson(@Param('id') id: string, @Res() res: Response) {
        const result = await this.lessonsService.getLessonById(Number(id));
        res.status(result.status).send(result);
    }

    @Get('/')
    async getAllLesson(@Res() res: Response) {
        const result = await this.lessonsService.getAllLessons();
        res.status(result.status).send(result);
    }

    @Get('/page/:page')
    async getLessonFromPage(@Param('page') page: number, @Res() res: Response) {
        const result = await this.lessonsService.getLessonsFromPage(page);
        res.status(result.status).send(result);
    }

    @Get('/limit/:limit')
    async getLessonLastLimited(@Param('limit') limit: number, @Res() res: Response) {
        const result = await this.lessonsService.getLessonsLastLimited(Number(limit));
        res.status(result.status).send(result);
    }

    @Post('/create')
    async createLesson(@Body() dto: CreateLessonDTO, @Res() res: Response) {
        const result = await this.lessonsService.createLesson(dto);
        res.status(result.status).send(result);
    }

    @Put('/update')
    async updateLesson(@Body() dto: UpdateLessonDTO, @Res() res: Response) {
        const result = await this.lessonsService.updateLesson(dto);
        res.status(result.status).send(result);
    }

    @Delete('/delete/:id')
    async deleteLesson(@Param('id') id: string, @Res() res: Response) {
        const result = await this.lessonsService.deleteLesson(Number(id));
        res.status(result.status).send(result);
    }
}
