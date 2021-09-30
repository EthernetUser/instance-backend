import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { CreateVisitorDTO } from '../../dto/createVisitor.dto';
import { ITokenPayload } from '../../interfaces/ITokenPayload';
import { IResponse } from '../../interfaces/Response/IResponse';
import { Visitor } from '../../models/visitor.model';
import { LessonsService } from '../lessons/lessons.service';
import { GenerateResponse } from '../../helpers/generateResponse';
import { IVisitorsResponse } from '../../interfaces/Response/IVisitorsResponse';

const VISITORS_NOT_FOUND = 'Не удалось найти участников занятия';
const WRONG_TOKEN = 'Неверный токен';
const SUCCESSFUL_SET_VISITOR = 'Вы были записаны на занятие';
const SERVER_ERROR = 'Ошибка сервера';

@Injectable()
export class VisitorsService {
    constructor(
        @InjectModel(Visitor) private visitorRepository: typeof Visitor,
        private jwtService: JwtService,
        private lessonsService: LessonsService,
    ) {}

    async getVisitorsByLessonId(id: number): Promise<IResponse<IVisitorsResponse<Visitor[]>>> {
        const visitors = await this.visitorRepository.findAll({ where: { lessons: { id } }, include: { all: true } });
        if (visitors)
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

    async setVisitor(dto: CreateVisitorDTO, token: string) {
        if (!token) {
            return this.createVisitor(dto);
        }
        const { lessonId } = dto;

        const lesson = await this.lessonsService.getLessonById(lessonId);
        if (lesson.error) return lesson;

        const tokenPayload: ITokenPayload = await this.jwtService.verify(token);
        if (!tokenPayload)
            return new GenerateResponse({
                status: HttpStatus.UNAUTHORIZED,
                error: true,
                message: WRONG_TOKEN,
                data: null,
            }) as IResponse<null>;

        const visitor = await this.visitorRepository.findOne({
            where: { userId: +tokenPayload.id },
        });

        if (!visitor) return this.createVisitor(dto, tokenPayload.id);
        await visitor.$set('lessons', lessonId);

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

    async createVisitor(dto: CreateVisitorDTO, id?: number) {
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
}
