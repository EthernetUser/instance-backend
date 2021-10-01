import { IsInt, IsNotEmpty } from 'class-validator';

export class DeleteVisitorDTO {
    @IsInt()
    @IsNotEmpty()
    lessonId: number;
}
