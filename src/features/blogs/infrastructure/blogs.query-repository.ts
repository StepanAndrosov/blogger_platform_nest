import { Injectable } from '@nestjs/common';
import {
  BlogOutputModel,
  BlogOutputModelMapper,
} from '../api/models/output/blog.output.model';
import { Blog, BlogModelType } from '../domain/blog.entity';
import { InjectModel } from '@nestjs/mongoose';
import {
  Pagination,
  PaginationOutput,
} from '../../../base/models/pagination.base.model';
import { FilterQuery } from 'mongoose';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query-repository';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name) private blogModel: BlogModelType,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) { }

  async getById(id: string): Promise<BlogOutputModel | null> {
    const blog = await this.blogModel.findOne({ _id: id });

    if (blog === null) {
      return null;
    }

    return BlogOutputModelMapper(blog);
  }

  async getAll(
    pagination: Pagination,
  ): Promise<PaginationOutput<BlogOutputModel>> {
    const filters: FilterQuery<Blog>[] = [];

    const filter: FilterQuery<Blog> = {};

    if (filters.length > 0) {
      filter.$or = filters;
    }

    return this.__getResult(filter, pagination);
  }

  async getPosts(blogId: string, pagination: Pagination) {
    const filters: FilterQuery<Blog>[] = [];

    const filter: FilterQuery<Blog> = {
      blogId,
    };

    if (filters.length > 0) {
      filter.$or = filters;
    }

    return this.postsQueryRepository.getByBlogId(filter, pagination);
  }

  private async __getResult(
    filter: FilterQuery<Blog>,
    pagination: Pagination,
  ): Promise<PaginationOutput<BlogOutputModel>> {

    const regex = new RegExp(pagination.searchNameTerm, 'i'); // нечувствительно к регистру

    const blogs = await this.blogModel
      .find({ name: regex })
      .find(filter)
      .sort({
        [pagination.sortBy]: pagination.getSortDirectionInNumericFormat(),
      })
      .skip(pagination.getSkipItemsCount())
      .limit(pagination.pageSize);

    const totalCount = await this.blogModel.countDocuments(
      filter
    );

    const mappedBlogs = blogs.map(BlogOutputModelMapper);

    return new PaginationOutput<BlogOutputModel>(
      mappedBlogs,
      pagination.pageNumber,
      pagination.pageSize,
      totalCount,
    );
  }
}
