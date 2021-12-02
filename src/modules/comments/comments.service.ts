import { ITokenPayload } from 'src/interfaces/ITokenPayload';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from '../../models/comment.model';
import { CreateCommentDTO } from '../../dto/createComment.dto';
import { UpdateCommentDTO } from '../../dto/updateComment.dto';
import { GenerateResponse } from '../../helpers/generateResponse';
import { ICommentsResponse } from '../../interfaces/Response/ICommentsResponse';
import { commentsServiceMock } from '../../__mock__/comments-service.mock';

@Injectable()
export class CommentsService {
    constructor(@InjectModel(Comment) private commentsRepository: typeof Comment) {}

    async getCommentsByEventId(eventId: number): Promise<GenerateResponse<ICommentsResponse<Comment[]> | null>> {
        const comments = await this.commentsRepository.findAll({ where: { eventId } });
        if (comments.length)
            return new GenerateResponse<ICommentsResponse<Comment[]>>({
                data: { comments },
            });
        else
            return new GenerateResponse<null>({
                status: HttpStatus.NOT_FOUND,
                message: commentsServiceMock.COMMENTS_DONT_EXIST,
                data: null,
            });
    }

    async getCommentsByUserId(userId: number): Promise<GenerateResponse<ICommentsResponse<Comment[]> | null>> {
        const comments = await this.commentsRepository.findAll({ where: { userId } });
        if (comments.length)
            return new GenerateResponse<ICommentsResponse<Comment[]>>({
                data: { comments },
            });
        else
            return new GenerateResponse<null>({
                status: HttpStatus.NOT_FOUND,
                message: commentsServiceMock.COMMENTS_DONT_EXIST,
                data: null,
            });
    }

    async createComment(dto: CreateCommentDTO, entity: ITokenPayload): Promise<GenerateResponse<null>> {
        const comment = await this.commentsRepository.create({ ...dto, userId: entity.id });
        if (comment)
            return new GenerateResponse<null>({
                message: commentsServiceMock.COMMENT_WAS_CREATED,
                data: null,
            });
        else
            return new GenerateResponse<null>({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: commentsServiceMock.COMMENT_WASNT_CREATED,
                data: null,
            });
    }

    async updateComment(dto: UpdateCommentDTO, entity: ITokenPayload): Promise<GenerateResponse<null>> {
        const comment = await this.commentsRepository.update(dto, { where: { id: dto.id, userId: entity.id } });
        if (comment)
            return new GenerateResponse<null>({
                message: commentsServiceMock.COMMENT_WAS_UPDATED,
                data: null,
            });
        else
            return new GenerateResponse<null>({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: commentsServiceMock.COMMENT_WASNT_UPDATED,
                data: null,
            });
    }

    async deleteComment(id: number, entity: ITokenPayload): Promise<GenerateResponse<null>> {
        const result = await this.commentsRepository.destroy({ where: { id, userId: entity.id } });
        if (result)
            return new GenerateResponse<null>({
                message: commentsServiceMock.COMMENT_WAS_DELETED,
                data: null,
            });
        else
            return new GenerateResponse<null>({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: commentsServiceMock.COMMENT_WASNT_DELETED,
                data: null,
            });
    }
}
