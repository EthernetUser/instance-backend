import { EntityTypes } from './../../enums/entityTypes.enum';
export interface IAuthResponse {
    token: string;
    id: number;
    type: EntityTypes;
}
