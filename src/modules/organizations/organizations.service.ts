import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { compare } from 'bcryptjs';
import { OrgRegistrationDTO } from 'src/dto/orgRegistration.dto';
import { LoginDTO } from '../../dto/login.dto';
import { GenerateResponse } from '../../helpers/generateResponse';
import { Organization } from '../../models/organization.model';
import { IOrganizationsResponse } from '../../interfaces/Response/IOrganizationsResponse';

const USER_NOT_FOUND = 'Пользователь не найден';

@Injectable()
export class OrganizationsService {
    constructor(@InjectModel(Organization) private organizationRepository: typeof Organization) {}

    async createOrganization(dto: OrgRegistrationDTO): Promise<Organization> {
        return await this.organizationRepository.create(dto);
    }

    async getOrganizationByEmail(email: string): Promise<GenerateResponse<IOrganizationsResponse<Organization>>> {
        const organizations = await this.organizationRepository.findOne({ where: { email }, include: { all: true } });
        if (organizations)
            return new GenerateResponse<IOrganizationsResponse<Organization>>({
                data: { organizations },
            });
        else
            return new GenerateResponse({
                status: HttpStatus.NOT_FOUND,
                error: true,
                message: USER_NOT_FOUND,
                data: null,
            }) as GenerateResponse<null>;
    }

    async getOrganizationById(id: number): Promise<GenerateResponse<IOrganizationsResponse<Organization>>> {
        const organizations = await this.organizationRepository.findByPk(id, { include: { all: true } });
        if (organizations)
            return new GenerateResponse<IOrganizationsResponse<Organization>>({
                data: { organizations },
            });
        else
            return new GenerateResponse({
                status: HttpStatus.NOT_FOUND,
                error: true,
                message: USER_NOT_FOUND,
                data: null,
            }) as GenerateResponse<null>;
    }

    async validateNewOrganization(email: string): Promise<boolean> {
        const organization = await this.organizationRepository.findOne({ where: { email } });
        return !organization;
    }

    async validateOrganization(dto: LoginDTO): Promise<Organization | null> {
        const organization = await this.organizationRepository.findOne({ where: { email: dto.email } });
        if (!organization) return null;
        const passwordEquals = await compare(dto.password, organization.password);
        if (passwordEquals) return organization;
        else return null;
    }
}
