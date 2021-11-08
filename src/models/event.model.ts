import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Comment } from './comment.model';
import { Organization } from './organization.model';
import { UserEvent } from './user-event.model';
import { User } from './user.model';

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

    // @BelongsToMany(() => Visitor, () => VisitorEvent)
    // visitors: Visitor[];

    @BelongsToMany(() => User, () => UserEvent)
    followingUsers: User[];

    @BelongsTo(() => Organization, 'organizationId')
    organization: Organization;

    @ForeignKey(() => Organization)
    @Column({ type: DataType.INTEGER })
    organizationId: number;
}
