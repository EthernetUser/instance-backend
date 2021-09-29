import { Comment } from '../models/comment.model';

export interface ICommentsResponse {
    comments: Comment | Comment[];
}
