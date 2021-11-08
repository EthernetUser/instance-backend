import { IsInt, IsNotEmpty } from 'class-validator';

export class DeleteVisitorDTO {
    @IsInt()
    @IsNotEmpty()
    eventId: number;
}
