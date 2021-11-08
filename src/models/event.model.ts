import { VisitorEvent } from './visitor-event.model';
import { Visitor } from './visitor.model';
import { Comment } from './comment.model';
import { BelongsToMany, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';

interface EventCreationAttrs {
    title: string;
    description: string;
    date: Date;
    location: string;
}

@Table({ tableName: 'events' })
export class Event extends Model<Event, EventCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    title: string;

    @Column({ type: DataType.STRING, allowNull: false })
    description: string;

    @Column({ type: DataType.DATE, allowNull: false })
    date: Date;

    @Column({ type: DataType.STRING, allowNull: false })
    location: string;

    @HasMany(() => Comment)
    eventComments: Comment[];

    @BelongsToMany(() => Visitor, () => VisitorEvent)
    visitors: Visitor[];
}
