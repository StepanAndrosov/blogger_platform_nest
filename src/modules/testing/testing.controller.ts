import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../users/domain/user.entity';
import { Blog, BlogModelType } from '../blogs/domain/blog.entity';
import { Comment, CommentModelType } from '../comments/domain/comment.entity';
import { Post, PostModelType } from '../posts/domain/post.entity';

@Controller('testing')
export class TestingController {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
    @InjectModel(Post.name) private PostModel: PostModelType,
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
  ) { }

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll() {
    await this.UserModel.deleteMany();
    await this.BlogModel.deleteMany();
    await this.PostModel.deleteMany();
    await this.CommentModel.deleteMany();
  }
}
