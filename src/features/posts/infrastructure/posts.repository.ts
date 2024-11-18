import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../domain/post.entity';
import { Types } from 'mongoose';
import { PostUpdateModel } from '../api/models/input/update-post.input.model';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

  async create(newPost: Post): Promise<string> {
    const insertResult = await this.PostModel.insertMany([newPost]);

    return insertResult[0].id;
  }

  async update(id: string, updateData: PostUpdateModel) {
    const foundPostModel = await this.PostModel.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!foundPostModel) return false;

    foundPostModel.updateOne(updateData);

    await foundPostModel.save();

    return true;
  }

  async delete(id: string): Promise<boolean> {
    const deletingResult = await this.PostModel.deleteOne({ _id: id });

    return deletingResult.deletedCount === 1;
  }
}