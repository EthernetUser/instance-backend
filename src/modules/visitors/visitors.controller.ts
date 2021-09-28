import { CreateVisitorDTO } from '../../dto/createVisitor.dto';
import { VisitorsService } from './visitors.service';
import { Controller, Post, Body, Get, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { TokenDecorator } from 'src/decorators/token.decorator';

@Controller('api/visitors')
export class VisitorsController {
    constructor(private visitorsService: VisitorsService) {}

    @UsePipes(ValidationPipe)
    @Post('/create')
    async createVisitor(@Body() dto: CreateVisitorDTO, @TokenDecorator() token: string) {
        console.log(dto);
        return this.visitorsService.setVisitor(dto, token);
    }

    @UsePipes(ValidationPipe)
    @Get('/lesson/:id')
    async getVisitorsByLessonId(@Param('id') id: string) {
        return this.visitorsService.getVisitorsByLessonId(Number(id));
    }
}
