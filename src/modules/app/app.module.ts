import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Comment } from '../../models/comment.model';
import { Event } from '../../models/event.model';
import { User } from '../../models/user.model';
import { VisitorEvent } from '../../models/visitor-event.model';
import { Visitor } from '../../models/visitor.model';
import { AuthModule } from '../auth/auth.module';
import { EventsModule } from '../events/events.module';
import { UsersModule } from '../users/users.module';
import { VisitorsModule } from '../visitors/visitors.module';
import { CommentsModule } from '../comments/comments.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`,
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USER,
            password: `${process.env.DB_PASSWORD}`,
            database: process.env.DB_NAME,
            autoLoadModels: true,
            models: [Event, User, Visitor, Comment, VisitorEvent],
            logging: false,
            synchronize: true,
        }),
        UsersModule,
        EventsModule,
        AuthModule,
        VisitorsModule,
        CommentsModule,
    ],
    providers: [],
})
export class AppModule {}
