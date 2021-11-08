import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Event } from './event.model';
import { Visitor } from './visitor.model';

@Table({ tableName: 'visitor_event', createdAt: false, updatedAt: false })
export class VisitorEvent extends Model<VisitorEvent> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ForeignKey(() => Visitor)
    @Column({ type: DataType.INTEGER })
    visitorId: number;

    @ForeignKey(() => Event)
    @Column({ type: DataType.INTEGER })
    eventId: number;
}
