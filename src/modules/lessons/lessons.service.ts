import { UpdateLessonDTO } from '../../dto/updateLesson.dto';
import { CreateLessonDTO } from '../../dto/createLesson.dto';
import { Lesson } from '../../models/lesson.model';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class LessonsService {
    constructor(@InjectModel(Lesson) private lessonRepository: typeof Lesson) {}

    async getLessonById(id: number): Promise<Lesson> {
        const lesson = await this.lessonRepository.findByPk(id, { include: { all: true } });
        if (lesson) return lesson;
        else throw new HttpException('Занятие не найдено', HttpStatus.NOT_FOUND);
    }

    async createLesson(dto: CreateLessonDTO) {
        const lesson = this.lessonRepository.create(dto);
        if (lesson) return { message: 'Занятие создано!' };
        else throw new HttpException('Ошибка сервера', HttpStatus.BAD_REQUEST);
    }

    async updateLesson({ id, title, description, date, location }: UpdateLessonDTO) {
        const lesson = await this.lessonRepository.update({ title, description, date, location }, { where: { id } });
        if (lesson) return { message: 'Занятие было обновленно!' };
        else throw new HttpException('Ошибка сервера', HttpStatus.BAD_REQUEST);
    }

    async deleteLesson(id: number) {
        const result = await this.lessonRepository.destroy({ where: { id } });
        if (result > 0) return { message: 'Занятие было удалено' };
        else throw new HttpException('Ошибка сервера', HttpStatus.BAD_REQUEST);
    }
}
