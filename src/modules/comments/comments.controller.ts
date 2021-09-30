import { ICommentsResponse } from '../../interfaces/Response/ICommentsResponse';
import { IResponse } from '../../interfaces/Response/IResponse';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDTO } from '../../dto/createComment.dto';
import { UpdateCommentDTO } from '../../dto/updateComment.dto';
import { Comment } from 'src/models/comment.model';

@Controller('api/comments')
export class CommentsController {
    constructor(private commentsService: CommentsService) {}

    @Get('/lesson/:id')
    async getCommentsByLessonId(@Param('id') id: string): Promise<IResponse<ICommentsResponse<Comment[]>>> {
        return await this.commentsService.getCommentsByLessonId(Number(id));
    }

    @Get('/user/:id')
    async getCommentsByUserId(@Param('id') id: string): Promise<IResponse<ICommentsResponse<Comment[]>>> {
        return await this.commentsService.getCommentsByUserId(Number(id));
    }

    @Post('/create')
    async createComment(@Body() dto: CreateCommentDTO): Promise<IResponse<null>> {
        return await this.commentsService.createComment(dto);
    }

    @Put('/update')
    async updateComment(@Body() dto: UpdateCommentDTO): Promise<IResponse<null>> {
        return await this.commentsService.updateComment(dto);
    }

    @Delete('/delete/:id')
    async deleteComment(@Param('id') id: string): Promise<IResponse<null>> {
        return await this.commentsService.deleteComment(Number(id));
    }
}
