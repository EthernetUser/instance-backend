import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginDTO {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
