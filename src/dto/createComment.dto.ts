import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDTO {
    @IsNotEmpty()
    @IsString()
    text: string;

    @IsNotEmpty()
    @IsBoolean()
    private: boolean;

    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    lessonId: number;
}
