import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from '../../models/comment.model';
import { CreateCommentDTO } from '../../dto/createComment.dto';
import { UpdateCommentDTO } from '../../dto/updateComment.dto';
import { GenerateResponse } from '../../helpers/generateResponse';
import { IResponse } from '../../interfaces/Response/IResponse';
import { ICommentsResponse } from '../../interfaces/Response/ICommentsResponse';

const COMMENTS_DONT_EXIST = 'Комментариев нет';
const COMMENT_WAS_CREATED = 'Комментарий был опубликован';
const COMMENT_WASNT_CREATED = 'Комментарий не был опубликован';
const COMMENT_WAS_UPDATED = 'Комментарий был отредактирован';
const COMMENT_WASNT_UPDATED = 'Комментарий не был отредактирован';
const COMMENT_WAS_DELETED = 'Комментарий был удален';
const COMMENT_WASNT_DELETED = 'Комментарий не был удален';

@Injectable()
export class CommentsService {
    constructor(@InjectModel(Comment) private commentsRepository: typeof Comment) {}

    async getCommentsByLessonId(lessonId: number): Promise<IResponse<ICommentsResponse<Comment[]> | null>> {
        const comments = await this.commentsRepository.findAll({ where: { lessonId } });
        if (comments.length)
            return new GenerateResponse({
                data: { comments },
            }) as IResponse<ICommentsResponse<Comment[]>>;
        else
            return new GenerateResponse({
                status: HttpStatus.NOT_FOUND,
                message: COMMENTS_DONT_EXIST,
                data: null,
            }) as IResponse<null>;
    }

    async getCommentsByUserId(userId: number): Promise<IResponse<ICommentsResponse<Comment[]> | null>> {
        const comments = await this.commentsRepository.findAll({ where: { userId } });
        if (comments.length)
            return new GenerateResponse({
                data: { comments },
            }) as IResponse<ICommentsResponse<Comment[]>>;
        else
            return new GenerateResponse({
                status: HttpStatus.NOT_FOUND,
                message: COMMENTS_DONT_EXIST,
                data: null,
            }) as IResponse<null>;
    }

    async createComment(dto: CreateCommentDTO): Promise<IResponse<null>> {
        const comment = await this.commentsRepository.create(dto);
        if (comment)
            return new GenerateResponse({
                message: COMMENT_WAS_CREATED,
                data: null,
            }) as IResponse<null>;
        else
            return new GenerateResponse({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: COMMENT_WASNT_CREATED,
                data: null,
            }) as IResponse<null>;
    }

    async updateComment(dto: UpdateCommentDTO): Promise<IResponse<null>> {
        const comment = await this.commentsRepository.update(dto, { where: { id: dto.id } });
        if (comment)
            return new GenerateResponse({
                message: COMMENT_WAS_UPDATED,
                data: null,
            }) as IResponse<null>;
        else
            return new GenerateResponse({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: COMMENT_WASNT_UPDATED,
                data: null,
            }) as IResponse<null>;
    }

    async deleteComment(id: number): Promise<IResponse<null>> {
        const result = await this.commentsRepository.destroy({ where: { id } });
        if (result)
            return new GenerateResponse({
                message: COMMENT_WAS_DELETED,
                data: null,
            }) as IResponse<null>;
        else
            return new GenerateResponse({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: COMMENT_WASNT_DELETED,
                data: null,
            }) as IResponse<null>;
    }
}
