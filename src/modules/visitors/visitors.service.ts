import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Lesson } from 'src/models/lesson.model';
import { CreateVisitorDTO } from '../../dto/createVisitor.dto';
import { GenerateResponse } from '../../helpers/generateResponse';
import { ITokenPayload } from '../../interfaces/ITokenPayload';
import { IResponse } from '../../interfaces/Response/IResponse';
import { IVisitorsResponse } from '../../interfaces/Response/IVisitorsResponse';
import { Visitor } from '../../models/visitor.model';
import { LessonsService } from '../lessons/lessons.service';
import { ILessonsResponse } from './../../interfaces/Response/ILessonsResponse';

const VISITORS_NOT_FOUND = 'Не удалось найти участников занятия';
const WRONG_TOKEN = 'Неверный токен';
const SUCCESSFUL_SET_VISITOR = 'Вы были записаны на занятие';
const SERVER_ERROR = 'Ошибка сервера';
const SUCCESSFUL_DELETED = 'Вы больше не записаны на занятие';
const UNSUCCESSFUL_DELETED = 'Ошибка сервера';

@Injectable()
export class VisitorsService {
    constructor(
        @InjectModel(Visitor) private visitorRepository: typeof Visitor,
        private jwtService: JwtService,
        private lessonsService: LessonsService,
    ) {}

    async getVisitorsByLessonId(id: number): Promise<IResponse<IVisitorsResponse<Visitor[]>>> {
        const visitors = await this.visitorRepository.findAll({
            include: {
                model: Lesson,
                where: {
                    id,
                },
                attributes: ['id'],
            },
        });
        if (visitors.length)
            return new GenerateResponse({
                data: { visitors },
            }) as IResponse<IVisitorsResponse<Visitor[]>>;
        else
            return new GenerateResponse({
                status: HttpStatus.NOT_FOUND,
                error: true,
                message: VISITORS_NOT_FOUND,
                data: null,
            }) as IResponse<null>;
    }

    async setVisitor(dto: CreateVisitorDTO, token: string): Promise<IResponse<ILessonsResponse<Lesson>>> {
        if (!token) {
            return this.createVisitor(dto);
        }

        const lesson: IResponse<ILessonsResponse<Lesson>> = await this.lessonsService.getLessonById(dto.lessonId);
        if (lesson.error) return lesson;

        const tokenPayload: ITokenPayload = await this.jwtService.verify(token);
        if (!tokenPayload)
            return new GenerateResponse({
                status: HttpStatus.UNAUTHORIZED,
                error: true,
                message: WRONG_TOKEN,
                data: null,
            }) as IResponse<null>;

        const visitor: Visitor = await this.visitorRepository.findOne({
            where: { userId: +tokenPayload.id },
            include: { all: true },
        });

        if (!visitor) return this.createVisitor(dto, tokenPayload.id);
        await visitor.$add('lessons', [dto.lessonId]);

        if (visitor)
            return new GenerateResponse({
                message: SUCCESSFUL_SET_VISITOR,
                data: null,
            }) as IResponse<null>;
        else
            return new GenerateResponse({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: SERVER_ERROR,
                data: null,
            }) as IResponse<null>;
    }

    async createVisitor(dto: CreateVisitorDTO, id?: number): Promise<IResponse<null>> {
        const visitor = await this.visitorRepository.create({ ...dto, userId: id });
        await visitor.$set('lessons', dto.lessonId);
        if (visitor)
            return new GenerateResponse({
                message: SUCCESSFUL_SET_VISITOR,
                data: null,
            }) as IResponse<null>;
        else
            return new GenerateResponse({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: SERVER_ERROR,
                data: null,
            }) as IResponse<null>;
    }

    async deleteVisitor(lessonId: number, token: string) {
        if (!token)
            return new GenerateResponse({
                status: HttpStatus.UNAUTHORIZED,
                error: true,
                message: WRONG_TOKEN,
                data: null,
            }) as IResponse<null>;
        const tokenPayload: ITokenPayload = await this.jwtService.verify(token);
        if (!tokenPayload)
            return new GenerateResponse({
                status: HttpStatus.UNAUTHORIZED,
                error: true,
                message: WRONG_TOKEN,
                data: null,
            });
        const visitor = await this.visitorRepository.findOne({
            where: { userId: +tokenPayload.id },
        });
        const result = await visitor.$remove('lessons', lessonId);

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
