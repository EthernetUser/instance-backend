import { VisitorEvent } from './visitor-event.model';
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Event } from './event.model';
import { User } from './user.model';

interface VisitorCreationAttrs {
    nickName?: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    isGuest: boolean;
    userId?: number;
}

@Table({ tableName: 'visitor' })
export class Visitor extends Model<Visitor, VisitorCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: true })
    userId: number;

    @BelongsTo(() => User, 'userId')
    user: User;

    @BelongsToMany(() => Event, () => VisitorEvent)
    events: Event[];

    @Column({ type: DataType.STRING, unique: false, allowNull: true })
    nickName: string;

    @Column({ type: DataType.STRING, unique: false, allowNull: false })
    firstName: string;

    @Column({ type: DataType.STRING, unique: false, allowNull: false })
    lastName: string;

    @Column({ type: DataType.STRING, unique: false })
    middleName: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    isGuest: boolean;
}
