import { VisitorLesson } from '../../models/visitor-lesson.model';
import { Visitor } from '../../models/visitor.model';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Lesson } from '../../models/lesson.model';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';

@Module({
    controllers: [LessonsController],
    imports: [SequelizeModule.forFeature([Lesson, Visitor, VisitorLesson])],
    providers: [LessonsService],
    exports: [LessonsService],
})
export class LessonsModule {}
