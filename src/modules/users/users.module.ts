import { UsersController } from './users.controller';
import { User } from '../../models/user.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from './users.service';
import { Module, forwardRef } from '@nestjs/common';

@Module({
    controllers: [UsersController],
    imports: [forwardRef(() => AuthModule), SequelizeModule.forFeature([User])],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
