import { Injectable } from '@nestjs/common';
import {
  CommentOutputModel,
  CommentOutputModelMapper,
} from '../api/models/output/comment.output.model';
import { Comment, CommentModelType } from '../domain/comment.entity';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery } from 'mongoose';
import { Post } from '../../posts/domain/post.entity';
import {
  Pagination,
  PaginationOutput,
} from '../../../base/models/pagination.base.model';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: CommentModelType,
  ) {}

  async getById(id: string): Promise<CommentOutputModel | null> {
    const comment = await this.commentModel.findOne({ _id: id });

    if (comment === null) {
      return null;
    }

    return CommentOutputModelMapper(comment);
  }

  async getByPostId(
    filter: FilterQuery<Comment>,
    pagination: Pagination,
  ): Promise<PaginationOutput<CommentOutputModel>> {
    return await this.__getResult(filter, pagination);
  }

  private async __getResult(
    filter: FilterQuery<Post>,
    pagination: Pagination,
  ): Promise<PaginationOutput<CommentOutputModel>> {
    const posts = await this.commentModel
      .find(filter)
      .sort({
        [pagination.sortBy]: pagination.getSortDirectionInNumericFormat(),
      })
      .skip(pagination.getSkipItemsCount())
      .limit(pagination.pageSize);

    const totalCount = await this.commentModel.countDocuments(filter);

    const mappedComments = posts.map(CommentOutputModelMapper);

    return new PaginationOutput<CommentOutputModel>(
      mappedComments,
      pagination.pageNumber,
      pagination.pageSize,
      totalCount,
    );
  }
}
