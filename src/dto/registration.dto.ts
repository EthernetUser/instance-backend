import { IsNotEmpty, IsString, Length } from 'class-validator';

export class RegistrationDTO {
    @IsString()
    @IsNotEmpty()
    nickName: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    middleName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(4, 16)
    password: string;

    @IsString()
    @IsNotEmpty()
    weaponProficiencyLevel: string;
}
