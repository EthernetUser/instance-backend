import { LessonsModule } from '../lessons/lessons.module';
import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Visitor } from '../../models/visitor.model';
import { AuthModule } from '../auth/auth.module';
import { VisitorsController } from './visitors.controller';
import { VisitorsService } from './visitors.service';

@Module({
    controllers: [VisitorsController],
    providers: [AuthModule, VisitorsService, LessonsModule],
    imports: [forwardRef(() => AuthModule), forwardRef(() => LessonsModule), SequelizeModule.forFeature([Visitor])],
})
export class VisitorsModule {}
