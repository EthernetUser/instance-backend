import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Event } from './event.model';

interface OrganizationCreationAttrs {
    name: string;
    email: string;
    password: string;
    description: string;
    category: string;
}

@Table({ tableName: 'organization' })
export class Organization extends Model<Organization, OrganizationCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING, unique: false, allowNull: false })
    name: string;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email: string;

    @Column({ type: DataType.STRING, allowNull: false })
    password: string;

    @Column({ type: DataType.STRING, allowNull: false })
    description: string;

    @Column({ type: DataType.STRING, allowNull: false })
    category: string;

    @Column({ type: DataType.STRING, allowNull: true })
    phone: string;

    @Column({ type: DataType.STRING, allowNull: true })
    links: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    verified: boolean;

    @Column({ type: DataType.STRING, allowNull: true, unique: true })
    verificationPath: string;

    @HasMany(() => Event)
    events: Event[];
}
