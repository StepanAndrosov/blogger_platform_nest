import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../domain/blog.entity';
import { Types } from 'mongoose';
import { BlogUpdateModel } from '../api/models/input/update-blog.input.model';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

  async create(newBlog: Blog): Promise<string> {
    const insertResult = await this.BlogModel.insertMany([newBlog]);

    return insertResult[0].id;
  }

  async update(id: string, updateData: BlogUpdateModel) {
    const foundBlogModel = await this.BlogModel.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!foundBlogModel) return false;

    foundBlogModel.updateOne(updateData);

    await foundBlogModel.save();

    return true;
  }

  async delete(id: string): Promise<boolean> {
    const deletingResult = await this.BlogModel.deleteOne({ _id: id });

    return deletingResult.deletedCount === 1;
  }
}
