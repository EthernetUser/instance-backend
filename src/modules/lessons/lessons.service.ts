import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateLessonDTO } from '../../dto/createLesson.dto';
import { UpdateLessonDTO } from '../../dto/updateLesson.dto';
import { Lesson } from '../../models/lesson.model';
import { IResponse } from './../../../dist/interfaces/IResponse.d';
import { GenerateResponse } from './../../helpers/generateResponse';
import { ILessonsResponse } from './../../interfaces/Response/ILessonsResponse';

const SUCCESSFUL_CREATED = 'Занятие было создано';
const UNSUCCESSFUL_CREATED = 'Занятие не было создано';
const SUCCESSFUL_UPDATED = 'Занятие было обновлено';
const UNSUCCESSFUL_UPDATED = 'Занятие не было обновлено';
const SUCCESSFUL_DELETED = 'Занятие было удалено';
const UNSUCCESSFUL_DELETED = 'Занятие не было удалено';
const LESSON_NOT_FOUND = 'Занятие не найдено';

@Injectable()
export class LessonsService {
    constructor(@InjectModel(Lesson) private lessonRepository: typeof Lesson) {}

    async getLessonById(id: number): Promise<IResponse<ILessonsResponse<Lesson>>> {
        const lesson = await this.lessonRepository.findByPk(id, { include: { all: true } });
        if (lesson)
            return new GenerateResponse({
                data: { lesson },
            }) as IResponse<ILessonsResponse<Lesson>>;
        else
            return new GenerateResponse({
                status: HttpStatus.NOT_FOUND,
                error: true,
                message: LESSON_NOT_FOUND,
                data: null,
            }) as IResponse<null>;
    }

    async createLesson(dto: CreateLessonDTO): Promise<IResponse<null>> {
        const lesson = this.lessonRepository.create(dto);
        if (lesson)
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

    async updateLesson({ id, title, description, date, location }: UpdateLessonDTO): Promise<IResponse<null>> {
        const lesson = await this.lessonRepository.update({ title, description, date, location }, { where: { id } });
        if (lesson)
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

    async deleteLesson(id: number): Promise<IResponse<null>> {
        const result = await this.lessonRepository.destroy({ where: { id } });
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
