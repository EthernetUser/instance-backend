import { EntityTypes } from '../enums/entityTypes.enum';
export interface ITokenPayload {
    type: EntityTypes;
    email: string;
    id: number;
    role?: string;
}
