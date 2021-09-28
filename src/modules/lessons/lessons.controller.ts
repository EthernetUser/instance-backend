import { UpdateLessonDTO } from '../../dto/updateLesson.dto';
import { CreateLessonDTO } from '../../dto/createLesson.dto';
import { LessonsService } from './lessons.service';
import { Controller, Post, Get, Param, Body, Put, Delete } from '@nestjs/common';

@Controller('/api/lesson')
export class LessonsController {
    constructor(private lessonsService: LessonsService) {}

    @Get('/:id')
    async getLesson(@Param('id') id: string) {
        const num_id = +id;
        return this.lessonsService.getLessonById(num_id);
    }

    @Post('/create')
    async createLesson(@Body() dto: CreateLessonDTO) {
        return this.lessonsService.createLesson(dto);
    }

    @Put('/update')
    async updateLesson(@Body() dto: UpdateLessonDTO) {
        return this.lessonsService.updateLesson(dto);
    }

    @Delete('/delete/:id')
    async deleteLesson(@Param('id') id: string) {
        const num_id = +id;
        return this.lessonsService.deleteLesson(num_id);
    }
}
