import { Controller, Delete } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../users/domain/user.entity';
import { Blog, BlogModelType } from '../blogs/domain/blog.entity';
import { Comment, CommentModelType } from '../comments/domain/comment.entity';

@Controller('testing')
export class TestingController {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
  ) {}

  @Delete('all-data')
  deleteAll() {
    this.UserModel.deleteMany();
    this.BlogModel.deleteMany();
    this.CommentModel.deleteMany();
  }
}
