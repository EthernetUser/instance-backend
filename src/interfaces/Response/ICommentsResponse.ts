import { Comment } from '../../models/comment.model';

export interface ICommentsResponse<T> {
    comments: T;
}
