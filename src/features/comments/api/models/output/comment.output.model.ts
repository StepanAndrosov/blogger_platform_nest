import { CommentDocument } from '../../../domain/comment.entity';

export type StatusLike = 'None';

export class CommentOutputModel {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: StatusLike;
  };
}

// MAPPERS

export const CommentOutputModelMapper = (
  comment: CommentDocument,
): CommentOutputModel => {
  const outputModel = new CommentOutputModel();

  outputModel.id = comment.id;
  outputModel.content = comment.content;
  outputModel.commentatorInfo = comment.commentatorInfo;
  outputModel.createdAt = comment.createdAt.toISOString();
  outputModel.likesInfo = comment.likesInfo;

  return outputModel;
};
