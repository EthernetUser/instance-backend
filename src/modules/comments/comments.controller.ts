import { EntityTypes } from 'src/enums/entityTypes.enum';
import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { TYPES } from 'src/decorators/jwt-type.decorator';
import { ITokenPayload } from 'src/interfaces/ITokenPayload';
import { CreateCommentDTO } from '../../dto/createComment.dto';
import { UpdateCommentDTO } from '../../dto/updateComment.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CommentsService } from './comments.service';

@Controller('api/comments')
export class CommentsController {
    constructor(private commentsService: CommentsService) {}

    @Get('/event/:id')
    async getCommentsByEventId(@Param('id') id: number, @Res() res: Response) {
        const result = await this.commentsService.getCommentsByEventId(Number(id));
        return res.status(result.status).send(result);
    }

    @Get('/user/:id')
    async getCommentsByUserId(@Param('id') id: number, @Res() res: Response) {
        const result = await this.commentsService.getCommentsByUserId(Number(id));
        return res.status(result.status).send(result);
    }

    @TYPES(EntityTypes.User)
    @UseGuards(JwtAuthGuard)
    @Post('/create')
    async createComment(
        @Body() dto: CreateCommentDTO,
        @Req() { tokenData }: { tokenData: ITokenPayload },
        @Res() res: Response,
    ) {
        const result = await this.commentsService.createComment(dto, tokenData);
        return res.status(result.status).send(result);
    }

    @TYPES(EntityTypes.User)
    @UseGuards(JwtAuthGuard)
    @Put('/update')
    async updateComment(
        @Body() dto: UpdateCommentDTO,
        @Req() { tokenData }: { tokenData: ITokenPayload },
        @Res() res: Response,
    ) {
        const result = await this.commentsService.updateComment(dto, tokenData);
        return res.status(result.status).send(result);
    }

    @TYPES(EntityTypes.User)
    @UseGuards(JwtAuthGuard)
    @Delete('/delete/:id')
    async deleteComment(
        @Param('id') id: number,
        @Req() { tokenData }: { tokenData: ITokenPayload },
        @Res() res: Response,
    ) {
        const result = await this.commentsService.deleteComment(Number(id), tokenData);
        return res.status(result.status).send(result);
    }
}
