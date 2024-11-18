import { Injectable } from '@nestjs/common';
import {
  PostOutputModel,
  PostOutputModelMapper,
} from '../api/models/output/post.output.model';
import { Post, PostModelType } from '../domain/post.entity';
import { InjectModel } from '@nestjs/mongoose';
import {
  Pagination,
  PaginationOutput,
} from '../../../base/models/pagination.base.model';
import { FilterQuery } from 'mongoose';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private postModel: PostModelType) {}

  async getById(id: string): Promise<PostOutputModel | null> {
    const post = await this.postModel.findOne({ _id: id });

    if (post === null) {
      return null;
    }

    return PostOutputModelMapper(post);
  }

  async getAll(
    pagination: Pagination,
  ): Promise<PaginationOutput<PostOutputModel>> {
    const filters: FilterQuery<Post>[] = [];

    const filter: FilterQuery<Post> = {};

    if (filters.length > 0) {
      filter.$or = filters;
    }

    return await this.__getResult(filter, pagination);
  }

  async getByBlogId(
    filter: FilterQuery<Post>,
    pagination: Pagination,
  ): Promise<PaginationOutput<PostOutputModel>> {

    return await this.__getResult(filter, pagination);
  }

  private async __getResult(
    filter: FilterQuery<Post>,
    pagination: Pagination,
  ): Promise<PaginationOutput<PostOutputModel>> {
    const posts = await this.postModel
      .find(filter)
      .sort({
        [pagination.sortBy]: pagination.getSortDirectionInNumericFormat(),
      })
      .skip(pagination.getSkipItemsCount())
      .limit(pagination.pageSize);

    const totalCount = await this.postModel.countDocuments(filter);

    const mappedPosts = posts.map(PostOutputModelMapper);

    return new PaginationOutput<PostOutputModel>(
      mappedPosts,
      pagination.pageNumber,
      pagination.pageSize,
      totalCount,
    );
  }
}
