import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostsQueryRepository } from '../infrastructure/posts.query-repository';
import { PostsService } from '../application/posts.service';
import { PostCreateModel } from './models/input/create-post.input.model';
import { PostOutputModel } from './models/output/post.output.model';
import { Pagination } from '../../../base/models/pagination.base.model';
import { SortingPropertiesType } from '../../../base/types/sorting-properties.type';
import { PostUpdateModel } from './models/input/update-post.input.model';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.query-repository';
import { COMMENTS_SORTING_PROPERTIES } from '../../comments/api/comments.controller';

export const POSTS_SORTING_PROPERTIES: SortingPropertiesType<PostOutputModel> =
  ['createdAt', 'content', 'blogName', 'blogId'];

// Tag для swagger
@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}

  @Get()
  async getAll(
    // Для работы с query
    @Query() query: { [p: string]: string },
  ) {
    const pagination: Pagination = new Pagination(
      query,
      POSTS_SORTING_PROPERTIES,
    );

    return this.postsQueryRepository.getAll(pagination);
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createModel: PostCreateModel) {
    const { title, content, shortDescription, blogId } = createModel;

    const foundBlog = await this.blogsQueryRepository.getById(blogId);
    if (!foundBlog) {
      throw new NotFoundException(`Blog with id ${blogId} not found`);
    }

    const createdBlogId = await this.postsService.create({
      createModel: { blogId, shortDescription, content, title },
      blogName: foundBlog.name,
    });

    return this.postsQueryRepository.getById(createdBlogId);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const post = await this.postsQueryRepository.getById(id);

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
  }

  @Get(':postId/comments')
  async getComments(
    @Param('postId') postId: string,
    @Query() query: { [p: string]: string },
  ) {
    const pagination: Pagination = new Pagination(
      query,
      COMMENTS_SORTING_PROPERTIES,
    );

    return this.postsQueryRepository.getComments(postId, pagination);
  }

  @Put(':id')
  @HttpCode(204)
  async update(@Param('id') id: string, @Body() updateModel: PostUpdateModel) {
    const { shortDescription, blogId, content, title } = updateModel;

    const isUpdated = await this.postsService.update(id, {
      shortDescription,
      blogId,
      content,
      title,
    });

    if (!isUpdated) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
  }

  @Delete(':id')
  // Для переопределения default статус кода https://docs.nestjs.com/controllers#status-code
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    const deletingResult: boolean = await this.postsService.delete(id);

    if (!deletingResult) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
  }
}
