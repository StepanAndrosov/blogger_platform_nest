import { Injectable } from '@nestjs/common';
import {
  BlogOutputModel,
  BlogOutputModelMapper,
} from '../api/models/output/blog.output.model';
import { Blog, BlogModelType } from '../domain/blog.entity';
import { InjectModel } from '@nestjs/mongoose';
import {
  PaginationOutput,
  PaginationWithSearchLoginAndEmailTerm,
} from '../../../base/models/pagination.base.model';
import { FilterQuery } from 'mongoose';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: BlogModelType) {}

  async getById(id: string): Promise<BlogOutputModel | null> {
    const user = await this.blogModel.findOne({ _id: id });

    if (user === null) {
      return null;
    }

    return BlogOutputModelMapper(user);
  }

  async getAll(
    pagination: PaginationWithSearchLoginAndEmailTerm,
  ): Promise<PaginationOutput<BlogOutputModel>> {
    const filters: FilterQuery<Blog>[] = [];

    if (pagination.searchEmailTerm) {
      filters.push({
        email: { $regex: pagination.searchEmailTerm, $options: 'i' },
      });
    }

    if (pagination.searchLoginTerm) {
      filters.push({
        login: { $regex: pagination.searchLoginTerm, $options: 'i' },
      });
    }

    const filter: FilterQuery<Blog> = {};

    if (filters.length > 0) {
      filter.$or = filters;
    }

    return await this.__getResult(filter, pagination);
  }

  private async __getResult(
    filter: FilterQuery<Blog>,
    pagination: PaginationWithSearchLoginAndEmailTerm,
  ): Promise<PaginationOutput<BlogOutputModel>> {
    const users = await this.blogModel
      .find(filter)
      .sort({
        [pagination.sortBy]: pagination.getSortDirectionInNumericFormat(),
      })
      .skip(pagination.getSkipItemsCount())
      .limit(pagination.pageSize);

    const totalCount = await this.blogModel.countDocuments(filter);

    const mappedBlogs = users.map(BlogOutputModelMapper);

    return new PaginationOutput<BlogOutputModel>(
      mappedBlogs,
      pagination.pageNumber,
      pagination.pageSize,
      totalCount,
    );
  }
}
