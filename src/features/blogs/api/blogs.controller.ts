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
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository';
import { BlogsService } from '../application/blogs.service';
import { BlogCreateModel } from './models/input/create-blog.input.model';
import { BlogOutputModel } from './models/output/blog.output.model';
import { Pagination } from '../../../base/models/pagination.base.model';
import { SortingPropertiesType } from '../../../base/types/sorting-properties.type';
import { BlogUpdateModel } from './models/input/update-blog.input.model';
import { POSTS_SORTING_PROPERTIES } from '../../posts/api/posts.controller';

export const BLOGS_SORTING_PROPERTIES: SortingPropertiesType<BlogOutputModel> =
  ['name', 'websiteUrl'];

// Tag для swagger
@ApiTags('Blogs')
@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}

  @Get()
  async getAll(
    // Для работы с query
    @Query() query: { [p: string]: string },
  ) {
    const pagination: Pagination = new Pagination(
      query,
      BLOGS_SORTING_PROPERTIES,
    );

    return this.blogsQueryRepository.getAll(pagination);
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createModel: BlogCreateModel) {
    const { name, websiteUrl, description } = createModel;

    const createdBlogId = await this.blogsService.create(
      name,
      description,
      websiteUrl,
    );

    return this.blogsQueryRepository.getById(createdBlogId);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const blog = await this.blogsQueryRepository.getById(id);

    if (!blog) {
      throw new NotFoundException('blog not found');
    }
    return blog;
  }

  @Put(':id')
  @HttpCode(204)
  async update(@Param('id') id: string, @Body() updateModel: BlogUpdateModel) {
    const { name, websiteUrl, description } = updateModel;

    const isUpdated = await this.blogsService.update(id, {
      name,
      description,
      websiteUrl,
    });

    if (!isUpdated) {
      throw new NotFoundException('blog not found');
    }
  }

  @Delete(':id')
  // Для переопределения default статус кода https://docs.nestjs.com/controllers#status-code
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    const deletingResult: boolean = await this.blogsService.delete(id);

    if (!deletingResult) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  @Get(':blogId/posts')
  async getPosts(
    @Param('blogId') blogId: string,
    @Query() query: { [p: string]: string },
  ) {
    const pagination: Pagination = new Pagination(
      query,
      POSTS_SORTING_PROPERTIES,
    );

    return this.blogsQueryRepository.getPosts(blogId, pagination);
  }
}
