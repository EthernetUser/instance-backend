import { Controller, Get, Param } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('api/comments')
export class CommentsController {
    constructor(private commentsService: CommentsService) {}

    @Get('/:lessonId')
    async getCommentsByLessonId(@Param('lessonId') lessonId: number) {
        return this.commentsService.getCommentsByLessonId(lessonId);
    }
}
