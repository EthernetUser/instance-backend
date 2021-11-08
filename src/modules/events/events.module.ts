import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Event } from '../../models/event.model';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
    controllers: [EventsController],
    imports: [SequelizeModule.forFeature([Event])],
    providers: [EventsService],
    exports: [EventsService],
})
export class EventsModule {}
