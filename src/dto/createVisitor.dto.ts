import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateVisitorDTO {
    nickName?: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    middleName?: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsBoolean()
    isGuest: boolean;

    eventId: number;
}
