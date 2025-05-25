import { NewLike, PostDocument } from '../../../domain/post.entity';

export type StatusLike = 'None';

export class PostOutputModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: StatusLike;
    newestLikes: NewLike[];
  };
}

// MAPPERS

export const PostOutputModelMapper = (post: PostDocument): PostOutputModel => {
  const outputModel = new PostOutputModel();

  outputModel.id = post.id;
  outputModel.title = post.title;
  outputModel.shortDescription = post.shortDescription;
  outputModel.content = post.content;
  outputModel.blogId = post.blogId;
  outputModel.blogName = post.blogName;
  outputModel.createdAt = post.createdAt.toISOString();
  outputModel.extendedLikesInfo = post.extendedLikesInfo;

  return outputModel;
};
