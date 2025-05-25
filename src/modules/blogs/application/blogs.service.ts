import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { BlogUpdateModel } from '../api/models/input/update-blog.input.model';

// Для провайдера всегда необходимо применять декоратор @Injectable() и регистрировать в модуле
@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async create(
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<string> {
    const newBlog: any = {
      name,
      description,
      websiteUrl,
      createdAt: new Date(),
      isMembership: false,
    };

    return this.blogsRepository.create(newBlog);
  }

  async update(id: string, updateModel: BlogUpdateModel): Promise<boolean> {
    const updateData: any = {
      name: updateModel.name,
      description: updateModel.description,
      websiteUrl: updateModel.websiteUrl,
    };

    return this.blogsRepository.update(id, updateData);
  }

  async delete(id: string): Promise<boolean> {
    return this.blogsRepository.delete(id);
  }
}
