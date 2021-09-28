import { Lesson } from './lesson.model';
import { User } from './user.model';
import { Column, DataType, Model, Table, BelongsTo, ForeignKey } from 'sequelize-typescript';

interface CommentCreationAttrs {
    text: string;
    private: boolean;
    userId: number;
    lessonId: number;
}

@Table({ tableName: 'comment' })
export class Comment extends Model<Comment, CommentCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.BLOB, unique: false, allowNull: false })
    text: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    private: boolean;

    @BelongsTo(() => User, 'userId')
    user: User;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number;

    @BelongsTo(() => Lesson, 'lessonId')
    lesson: Lesson;

    @ForeignKey(() => Lesson)
    @Column({ type: DataType.INTEGER })
    lessonId: number;
}
