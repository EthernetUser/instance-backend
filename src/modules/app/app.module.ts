import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Comment } from '../../models/comment.model';
import { Lesson } from '../../models/lesson.model';
import { User } from '../../models/user.model';
import { VisitorLesson } from '../../models/visitor-lesson.model';
import { Visitor } from '../../models/visitor.model';
import { AuthModule } from '../auth/auth.module';
import { LessonsModule } from '../lessons/lessons.module';
import { UsersModule } from '../users/users.module';
import { VisitorsModule } from '../visitors/visitors.module';
import { AppController } from './app.controller';

@Module({
    controllers: [AppController],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`,
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: +process.env.POSTGRES_PORT,
            username: process.env.POSTGRES_USER,
            password: `${process.env.POSTGRES_PASSWORD}`,
            database: process.env.POSTGRES_DB,
            autoLoadModels: true,
            models: [Lesson, User, Visitor, Comment, VisitorLesson],
            logging: false,
            synchronize: true,
        }),
        UsersModule,
        LessonsModule,
        AuthModule,
        VisitorsModule,
    ],
    providers: [],
})
export class AppModule {}
