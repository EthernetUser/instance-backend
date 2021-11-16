import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Organization } from 'src/models/organization.model';
import { AuthModule } from '../auth/auth.module';
import { EventsModule } from '../events/events.module';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';

@Module({
    controllers: [OrganizationsController],
    imports: [SequelizeModule.forFeature([Organization]), forwardRef(() => AuthModule), EventsModule],
    providers: [OrganizationsService],
    exports: [OrganizationsService],
})
export class OrganizationsModule {}
