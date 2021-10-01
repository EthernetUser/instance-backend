import { DeleteVisitorDTO } from './../../dto/deleteVisitor.dto';
import { CreateVisitorDTO } from '../../dto/createVisitor.dto';
import { VisitorsService } from './visitors.service';
import { Controller, Post, Body, Get, Param, UsePipes, ValidationPipe, Delete, Res } from '@nestjs/common';
import { TokenDecorator } from 'src/decorators/token.decorator';
import { Response } from 'express';

@Controller('api/visitors')
export class VisitorsController {
    constructor(private visitorsService: VisitorsService) {}

    @UsePipes(ValidationPipe)
    @Post('/create')
    async createVisitor(@Body() dto: CreateVisitorDTO, @TokenDecorator() token: string, @Res() res: Response) {
        const result = await this.visitorsService.setVisitor(dto, token);
        res.status(result.status).send(result);
    }

    @UsePipes(ValidationPipe)
    @Get('/lesson/:id')
    async getVisitorsByLessonId(@Param('id') id: string, @Res() res: Response) {
        const result = await this.visitorsService.getVisitorsByLessonId(Number(id));
        res.status(result.status).send(result);
    }

    @UsePipes(ValidationPipe)
    @Delete('/delete')
    async deleteVisitor(@Body() { lessonId }: DeleteVisitorDTO, @TokenDecorator() token: string, @Res() res: Response) {
        const result = await this.visitorsService.deleteVisitor(lessonId, token);
        res.status(result.status).send(result);
    }
}
