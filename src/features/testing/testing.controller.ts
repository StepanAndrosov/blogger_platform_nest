import { Controller, Delete } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../users/domain/user.entity';
import { Blog, BlogModelType } from '../blogs/domain/blog.entity';

@Controller('testing')
export class TestingController {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
  @InjectModel(Blog.name) private BlogModel: BlogModelType
  ) {}

  @Delete()
  deleteAll() {
    this.UserModel.deleteMany();
    this.BlogModel.deleteMany();
  }
}
