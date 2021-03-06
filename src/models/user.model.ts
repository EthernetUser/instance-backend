import { BelongsToMany, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { RolesEnum } from '../enums/roles.enum';
import { weaponProficiencyLevel } from '../enums/weaponProfLevel.enum';
import { Comment } from './comment.model';
import { Event } from './event.model';
import { UserEvent } from './user-event.model';

interface UserCreationAttrs {
    nickName: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    password: string;
    weaponProficiencyLevel: string;
}

@Table({ tableName: 'user' })
export class User extends Model<User, UserCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING, unique: false, allowNull: true })
    nickName: string;

    @Column({ type: DataType.STRING, unique: false, allowNull: false })
    firstName: string;

    @Column({ type: DataType.STRING, unique: false, allowNull: true })
    middleName: string;

    @Column({ type: DataType.STRING, unique: false, allowNull: false })
    lastName: string;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email: string;

    @Column({ type: DataType.STRING, allowNull: false })
    password: string;

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: RolesEnum.Student })
    role: string;

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: weaponProficiencyLevel.Beginner })
    weaponProficiencyLevel: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    verified: boolean;

    @Column({ type: DataType.STRING, allowNull: true, unique: true })
    verificationPath: string;

    @BelongsToMany(() => Event, () => UserEvent)
    followedEvents: Event[];

    @HasMany(() => Comment)
    userComments: Comment[];
}
