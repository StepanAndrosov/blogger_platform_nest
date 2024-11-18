import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';
import { PostUpdateModel } from '../api/models/input/update-post.input.model';
import { PostCreateModel } from '../api/models/input/create-post.input.model';
import { StatusLike } from '../api/models/output/post.output.model';

// Для провайдера всегда необходимо применять декоратор @Injectable() и регистрировать в модуле
@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async create({
    createModel,
    blogName,
  }: {
    createModel: PostCreateModel;
    blogName: string;
  }): Promise<string> {
    const newPost = {
      title: createModel.title,
      shortDescription: createModel.shortDescription,
      content: createModel.content,
      blogId: createModel.blogId,
      blogName: blogName,
      createdAt: new Date(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None' as StatusLike,
        newestLikes: [],
      },
    };

    return this.postsRepository.create(newPost);
  }

  async update(id: string, updateModel: PostUpdateModel): Promise<boolean> {
    const updateData = {
      title: updateModel.title,
      shortDescription: updateModel.shortDescription,
      content: updateModel.content,
      blogId: updateModel.blogId,
    };

    return this.postsRepository.update(id, updateData);
  }

  async delete(id: string): Promise<boolean> {
    return this.postsRepository.delete(id);
  }
}
