import { VisitorLesson } from './visitor-lesson.model';
import { Visitor } from './visitor.model';
import { Comment } from './comment.model';
import { RolesEnum } from '../enums/roles.enum';
import { BelongsToMany, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';

interface LessonCreationAttrs {
    title: string;
    description: string;
    date: Date;
    location: string;
}

@Table({ tableName: 'lesson' })
export class Lesson extends Model<Lesson, LessonCreationAttrs> {
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
    lessonComments: Comment[];

    @BelongsToMany(() => Visitor, () => VisitorLesson)
    visitors: Visitor[];
}
