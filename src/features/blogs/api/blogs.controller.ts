import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query-repository';
import { PostsService } from '../../posts/application/posts.service';
import { PostCreateModel } from './models/input/create-post.input.model';

export const BLOGS_SORTING_PROPERTIES: SortingPropertiesType<BlogOutputModel> =
  ['name', 'websiteUrl', 'id', 'createdAt'];

// Tag для swagger
@ApiTags('Blogs')
@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postsService: PostsService,
  ) { }

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
      throw new NotFoundException(`Blog with id ${id} not found`);
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
      throw new NotFoundException(`Blog with id ${id} not found`);
    }
  }

  @Delete(':id')
  // Для переопределения default статус кода https://docs.nestjs.com/controllers#status-code
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    const deletingResult: boolean = await this.blogsService.delete(id);

    if (!deletingResult) {
      throw new NotFoundException(`Blog with id ${id} not found`);
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

    const posts = await this.blogsQueryRepository.getPosts(blogId, pagination);

    if (!posts) {
      throw new NotFoundException(`Posts with id ${blogId} not found`);
    }

    return posts;
  }

  @Post(':blogId/posts')
  async createPosts(
    @Param('blogId') blogId: string,
    @Body() createModel: PostCreateModel,
  ) {
    const { title, content, shortDescription } = createModel;

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
}
