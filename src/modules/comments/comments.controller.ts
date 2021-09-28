import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDTO } from '../../dto/createComment.dto';
import { UpdateCommentDTO } from '../../dto/updateComment.dto';

@Controller('api/comments')
export class CommentsController {
    constructor(private commentsService: CommentsService) {}

    @Get('/:lessonId')
    async getCommentsByLessonId(@Param('lessonId') lessonId: number) {
        return this.commentsService.getCommentsByLessonId(lessonId);
    }

    @Post('/create')
    async createComment(@Body() dto: CreateCommentDTO) {
        return this.commentsService.createComment(dto);
    }

    @Put('/update')
    async updateComment(@Body() dto: UpdateCommentDTO) {
        return this.commentsService.updateComment(dto);
    }

    @Delete('/delete/:id')
    async deleteComment(@Param('id') id: number) {
        return this.commentsService.deleteComment(id);
    }
}
