import { EventsModule } from '../events/events.module';
import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Visitor } from '../../models/visitor.model';
import { AuthModule } from '../auth/auth.module';
import { VisitorsController } from './visitors.controller';
import { VisitorsService } from './visitors.service';

@Module({
    controllers: [VisitorsController],
    providers: [AuthModule, VisitorsService, EventsModule],
    imports: [forwardRef(() => AuthModule), forwardRef(() => EventsModule), SequelizeModule.forFeature([Visitor])],
})
export class VisitorsModule {}
