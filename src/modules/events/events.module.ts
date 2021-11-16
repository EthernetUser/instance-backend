import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { Event } from '../../models/event.model';
import { AuthModule } from '../auth/auth.module';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
    controllers: [EventsController],
    imports: [SequelizeModule.forFeature([Event, User]), forwardRef(() => AuthModule)],
    providers: [EventsService],
    exports: [EventsService],
})
export class EventsModule {}
