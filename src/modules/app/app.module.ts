import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Comment } from '../../models/comment.model';
import { Event } from '../../models/event.model';
import { User } from '../../models/user.model';
import { AuthModule } from '../auth/auth.module';
import { EventsModule } from '../events/events.module';
import { UsersModule } from '../users/users.module';
import { CommentsModule } from '../comments/comments.module';
import { Organization } from 'src/models/organization.model';
import { UserEvent } from 'src/models/user-event.model';
import { OrganizationsModule } from '../organizations/organizations.module';

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
            models: [Event, User, Comment, Organization, UserEvent],
            logging: false,
            synchronize: true,
        }),
        UsersModule,
        EventsModule,
        AuthModule,
        CommentsModule,
        OrganizationsModule,
    ],
    providers: [],
})
export class AppModule {}
