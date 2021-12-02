import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcryptjs';
import { OrgRegistrationDTO } from 'src/dto/orgRegistration.dto';
import { EntityTypes } from 'src/enums/entityTypes.enum';
import { Organization } from 'src/models/organization.model';
import { LoginDTO } from '../../dto/login.dto';
import { UserRegistrationDTO } from '../../dto/userRegistration.dto';
import { GenerateResponse } from '../../helpers/generateResponse';
import { ITokenPayload } from '../../interfaces/ITokenPayload';
import { User } from '../../models/user.model';
import { UsersService } from '../users/users.service';
import { IAuthResponse } from './../../interfaces/Response/IAuthResponse';
import { OrganizationsService } from './../organizations/organizations.service';

const THIS_EMAIL_WAS_ALREADY_REGISTERED = 'Данная почта уже зарегистрирована';
const SUCCESSFUL_REGISTRATION = 'Вы были зарегистрированны';
const UNSUCCESSFUL_REGISTRATION = 'Ошибка регистрации';
const SUCCESSFUL_LOGIN = 'Вы вошли в аккаунт';
const UNSUCCESSFUL_LOGIN = 'Ошибка входа, данные не верны';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private organizationsService: OrganizationsService,
    ) {}

    async userRegistration(dto: UserRegistrationDTO): Promise<GenerateResponse<IAuthResponse>> {
        const IsOrgValid = await this.organizationsService.validateNewOrganization(dto.email);
        const IsUserValid = await this.usersService.validateNewUser(dto.email);
        if (!IsUserValid || !IsOrgValid)
            return new GenerateResponse<null>({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: THIS_EMAIL_WAS_ALREADY_REGISTERED,
                data: null,
            });
        const user = await this.usersService.createUser({ ...dto, password: await hash(dto.password, 10) });
        if (user)
            return new GenerateResponse<IAuthResponse>({
                message: SUCCESSFUL_REGISTRATION,
                data: {
                    token: (await this.generateToken(user)).token,
                    id: user.id,
                    type: EntityTypes.User,
                },
            });
        else
            return new GenerateResponse<null>({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: UNSUCCESSFUL_REGISTRATION,
                data: null,
            });
    }

    async organizationRegistration(dto: OrgRegistrationDTO): Promise<GenerateResponse<IAuthResponse>> {
        const IsOrgValid = await this.organizationsService.validateNewOrganization(dto.email);
        const IsUserValid = await this.usersService.validateNewUser(dto.email);
        if (!IsOrgValid || !IsUserValid)
            return new GenerateResponse<null>({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: THIS_EMAIL_WAS_ALREADY_REGISTERED,
                data: null,
            });
        const organization = await this.organizationsService.createOrganization({
            ...dto,
            password: await hash(dto.password, 10),
        });
        if (organization) {
            return new GenerateResponse<IAuthResponse>({
                message: SUCCESSFUL_REGISTRATION,
                data: {
                    token: (await this.generateToken(organization)).token,
                    id: organization.id,
                    type: EntityTypes.Organization,
                },
            });
        } else {
            return new GenerateResponse<null>({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: UNSUCCESSFUL_REGISTRATION,
                data: null,
            });
        }
    }

    async login(dto: LoginDTO): Promise<GenerateResponse<IAuthResponse>> {
        const user = await this.usersService.validateUser(dto);
        if (user)
            return new GenerateResponse<IAuthResponse>({
                message: SUCCESSFUL_LOGIN,
                data: {
                    token: (await this.generateToken(user)).token,
                    id: user.id,
                    type: EntityTypes.User,
                },
            });
        else
            return new GenerateResponse<null>({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: UNSUCCESSFUL_LOGIN,
                data: null,
            });
    }

    async organizationLogin(dto: LoginDTO): Promise<GenerateResponse<IAuthResponse>> {
        const organization = await this.organizationsService.validateOrganization(dto);
        if (organization)
            return new GenerateResponse<IAuthResponse>({
                message: SUCCESSFUL_LOGIN,
                data: {
                    token: (await this.generateToken(organization)).token,
                    id: organization.id,
                    type: EntityTypes.Organization,
                },
            });
        else
            return new GenerateResponse<IAuthResponse>({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: UNSUCCESSFUL_LOGIN,
                data: null,
            });
    }

    async generateToken(entity: User | Organization) {
        if (entity instanceof User) {
            const payload: ITokenPayload = {
                type: EntityTypes.User,
                email: entity.email,
                id: entity.id,
                role: entity.role,
            };
            return {
                token: this.jwtService.sign(payload),
            };
        } else {
            const payload: ITokenPayload = { type: EntityTypes.Organization, email: entity.email, id: entity.id };
            return {
                token: this.jwtService.sign(payload),
            };
        }
    }
}
