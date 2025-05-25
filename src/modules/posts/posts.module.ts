import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './application/posts.service';
import { PostsRepository } from './infrastructure/posts.repository';
import { PostsQueryRepository } from './infrastructure/posts.query-repository';
import { PostsController } from './api/posts.controller';
import { Post, PostSchema } from './domain/post.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, PostsQueryRepository],
  exports: [PostsRepository, MongooseModule],
})
export class PostsModule {}
