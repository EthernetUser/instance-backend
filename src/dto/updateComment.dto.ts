import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCommentDTO {
    @IsNotEmpty()
    @IsNumber()
    id: number;

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
    eventId: number;
}
