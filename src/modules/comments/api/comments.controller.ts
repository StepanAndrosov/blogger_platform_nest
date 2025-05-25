import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/comments.query-repository';
import { SortingPropertiesType } from '../../../base/types/sorting-properties.type';
import { CommentOutputModel } from './models/output/comment.output.model';

export const COMMENTS_SORTING_PROPERTIES: SortingPropertiesType<CommentOutputModel> =
  ['createdAt', 'content'];

// Tag для swagger
@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    const comment = await this.commentsQueryRepository.getById(id);

    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return comment;
  }
}
