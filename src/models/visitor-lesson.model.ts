import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Lesson } from './lesson.model';
import { Visitor } from './visitor.model';

@Table({ tableName: 'visitor_lesson', createdAt: false, updatedAt: false })
export class VisitorLesson extends Model<VisitorLesson> {
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

    @ForeignKey(() => Lesson)
    @Column({ type: DataType.INTEGER })
    lessonId: number;
}
