import { OrganizationsService } from './../organizations/organizations.service';
import { ITokenPayload } from '../../interfaces/ITokenPayload';
import { LoginDTO } from '../../dto/login.dto';
import { UsersService } from '../users/users.service';
import { UserRegistrationDTO } from '../../dto/userRegistration.dto';
import { User } from '../../models/user.model';
import { HttpStatus, Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { GenerateResponse } from '../../helpers/generateResponse';
import { IResponse } from '../../interfaces/Response/IResponse';
import { ITokenResponse } from '../../interfaces/Response/ITokenResponse';
import { OrgRegistrationDTO } from 'src/dto/orgRegistration.dto';
import { Organization } from 'src/models/organization.model';
import { EntityTypes } from 'src/enums/entityTypes.enum';

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

    async userRegistration(dto: UserRegistrationDTO): Promise<IResponse<ITokenResponse | null>> {
        const IsOrgValid = await this.organizationsService.validateNewOrganization(dto.email);
        const IsUserValid = await this.usersService.validateNewUser(dto.email);
        if (!IsUserValid || !IsOrgValid)
            return new GenerateResponse({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: THIS_EMAIL_WAS_ALREADY_REGISTERED,
                data: null,
            }) as IResponse<null>;
        const user = await this.usersService.createUser({ ...dto, password: await hash(dto.password, 10) });
        if (user)
            return new GenerateResponse({
                message: SUCCESSFUL_REGISTRATION,
                data: await this.generateToken(user),
            }) as IResponse<ITokenResponse>;
        else
            return new GenerateResponse({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: UNSUCCESSFUL_REGISTRATION,
                data: null,
            }) as IResponse<null>;
    }

    async organizationRegistration(dto: OrgRegistrationDTO): Promise<IResponse<ITokenResponse | null>> {
        const IsOrgValid = await this.organizationsService.validateNewOrganization(dto.email);
        const IsUserValid = await this.usersService.validateNewUser(dto.email);
        if (!IsOrgValid || !IsUserValid)
            return new GenerateResponse({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: THIS_EMAIL_WAS_ALREADY_REGISTERED,
                data: null,
            }) as IResponse<null>;
        const organization = await this.organizationsService.createOrganization({
            ...dto,
            password: await hash(dto.password, 10),
        });
        if (organization)
            return new GenerateResponse({
                message: SUCCESSFUL_REGISTRATION,
                data: await this.generateToken(organization),
            }) as IResponse<ITokenResponse>;
        else
            return new GenerateResponse({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: UNSUCCESSFUL_REGISTRATION,
                data: null,
            }) as IResponse<null>;
    }

    async login(dto: LoginDTO): Promise<IResponse<ITokenResponse | null>> {
        const user = await this.usersService.validateUser(dto);
        if (user)
            return new GenerateResponse({
                message: SUCCESSFUL_LOGIN,
                data: await this.generateToken(user),
            }) as IResponse<ITokenResponse>;
        else
            return new GenerateResponse({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: UNSUCCESSFUL_LOGIN,
                data: null,
            }) as IResponse<null>;
    }

    async organizationLogin(dto: LoginDTO): Promise<IResponse<ITokenResponse | null>> {
        const organization = await this.organizationsService.validateOrganization(dto);
        if (organization)
            return new GenerateResponse({
                message: SUCCESSFUL_LOGIN,
                data: await this.generateToken(organization),
            }) as IResponse<ITokenResponse>;
        else
            return new GenerateResponse({
                status: HttpStatus.BAD_REQUEST,
                error: true,
                message: UNSUCCESSFUL_LOGIN,
                data: null,
            }) as IResponse<null>;
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
