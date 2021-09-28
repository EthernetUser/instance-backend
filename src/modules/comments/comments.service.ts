import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from '../../models/comment.model';
import { CreateCommentDTO } from '../../dto/createComment.dto';
import { UpdateCommentDTO } from '../../dto/updateComment.dto';

@Injectable()
export class CommentsService {
    constructor(@InjectModel(Comment) private commentsRepository: typeof Comment) {}

    async getCommentsByLessonId(lessonId: number) {
        const comments = this.commentsRepository.findAll({ where: { lessonId } });
        if (comments) return comments;
        else throw new HttpException('Комметнариев нет', HttpStatus.NOT_FOUND);
    }

    async getCommentsByUserId(userId: number) {
        const comments = this.commentsRepository.findAll({ where: { userId } });
        if (comments) return comments;
        else throw new HttpException('Комметнариев нет', HttpStatus.NOT_FOUND);
    }

    async createComment(dto: CreateCommentDTO) {
        const comment = this.commentsRepository.create(dto);
        if (comment) return 'Комментарий был создан';
        else throw new HttpException('Комментарий не был создан', HttpStatus.BAD_REQUEST);
    }

    async updateComment(dto: UpdateCommentDTO) {
        const comment = this.commentsRepository.update(dto, { where: { id: dto.id } });
        if (comment) return 'Комментарий был обновлен';
        else throw new HttpException('Комментарий не был обнавлен', HttpStatus.BAD_REQUEST);
    }

    async deleteComment(id: number) {
        const result = this.commentsRepository.destroy({ where: { id } });
        if (result) return 'Комментарий был удален';
        else throw new HttpException('Комментарий не был удален', HttpStatus.BAD_REQUEST);
    }
}
