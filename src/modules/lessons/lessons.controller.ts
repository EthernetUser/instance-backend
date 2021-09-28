import { UpdateLessonDTO } from '../../dto/updateLesson.dto';
import { CreateLessonDTO } from '../../dto/createLesson.dto';
import { LessonsService } from './lessons.service';
import { Controller, Post, Get, Param, Body, Put, Delete } from '@nestjs/common';

@Controller('/api/lesson')
export class LessonsController {
    constructor(private lessonsService: LessonsService) {}

    @Get('/:id')
    async getLesson(@Param('id') id: string) {
        return await this.lessonsService.getLessonById(Number(id));
    }

    @Post('/create')
    async createLesson(@Body() dto: CreateLessonDTO) {
        return await this.lessonsService.createLesson(dto);
    }

    @Put('/update')
    async updateLesson(@Body() dto: UpdateLessonDTO) {
        return await this.lessonsService.updateLesson(dto);
    }

    @Delete('/delete/:id')
    async deleteLesson(@Param('id') id: string) {
        return await this.lessonsService.deleteLesson(Number(id));
    }
}
