import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Event } from './event.model';
import { User } from './user.model';

@Table({ tableName: 'user_event', createdAt: false, updatedAt: false })
export class UserEvent extends Model<UserEvent> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number;

    @ForeignKey(() => Event)
    @Column({ type: DataType.INTEGER })
    eventId: number;
}
