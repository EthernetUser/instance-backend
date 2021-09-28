import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateLessonDTO {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsDateString()
    date: Date;

    @IsNotEmpty()
    @IsString()
    location: string;
}
