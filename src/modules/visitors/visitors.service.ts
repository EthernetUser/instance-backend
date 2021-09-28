import { LessonsService } from '../lessons/lessons.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { CreateVisitorDTO } from '../../dto/createVisitor.dto';
import { ITokenPayload } from '../../interfaces/ITokenPayload';
import { Visitor } from '../../models/visitor.model';

@Injectable()
export class VisitorsService {
    constructor(
        @InjectModel(Visitor) private visitorRepository: typeof Visitor,
        private jwtService: JwtService,
        private lessonsService: LessonsService,
    ) {}

    async getVisitorsByLessonId(id: number) {
        const visitors = await this.visitorRepository.findAll({ where: { lessons: { id } }, include: { all: true } });
        if (visitors) return visitors;
        else throw new HttpException('Не удалось найти участников занятия', HttpStatus.BAD_REQUEST);
    }

    async setVisitor(dto: CreateVisitorDTO, token: string) {
        if (!token) {
            return this.createVisitor(dto);
        }
        const { lessonId } = dto;
        await this.lessonsService.getLessonById(lessonId);
        const tokenPayload: ITokenPayload = await this.jwtService.verify(token);
        if (!tokenPayload) throw new HttpException('Неверный токен', HttpStatus.BAD_REQUEST);
        const visitor = await this.visitorRepository.findOne({
            where: { userId: +tokenPayload.id },
        });
        if (!visitor) return this.createVisitor(dto, tokenPayload.id);
        await visitor.$set('lessons', lessonId);
        if (visitor) return 'Вы были записаны на занятие!';
        else throw new HttpException('Ошибка сервера', HttpStatus.BAD_REQUEST);
    }

    async createVisitor(dto: CreateVisitorDTO, id?: number) {
        const visitor = await this.visitorRepository.create({ ...dto, userId: id });
        await visitor.$set('lessons', dto.lessonId);
        if (visitor) return 'Вы были записаны на занятие!';
        else throw new HttpException('Ошибка сервера', HttpStatus.BAD_REQUEST);
    }
}
