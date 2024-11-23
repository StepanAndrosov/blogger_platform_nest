import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { UserAccountsModule } from '../users/user-accounts.module';
import { BlogsModule } from '../blogs/blogs.module';
import { PostsModule } from '../posts/posts.module';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [UserAccountsModule, BlogsModule, PostsModule, CommentsModule],
  controllers: [TestingController],
})
export class TestingModule {}
