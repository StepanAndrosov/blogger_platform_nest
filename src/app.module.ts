import { Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppSettings, appSettings } from './settings/app-settings';
import { UsersRepository } from './modules/users/infrastructure/users.repository';
import { UsersService } from './modules/users/application/users.service';
import { UsersQueryRepository } from './modules/users/infrastructure/users.query-repository';
import { User, UserSchema } from './modules/users/domain/user.entity';
import { UsersController } from './modules/users/api/users.controller';
import { AuthService } from './modules/auth/application/auth.service';
import { BlogsController } from './modules/blogs/api/blogs.controller';
import { BlogsRepository } from './modules/blogs/infrastructure/blogs.repository';
import { BlogsService } from './modules/blogs/application/blogs.service';
import { BlogsQueryRepository } from './modules/blogs/infrastructure/blogs.query-repository';
import { Blog, BlogSchema } from './modules/blogs/domain/blog.entity';
import { Post, PostSchema } from './modules/posts/domain/post.entity';
import { PostsRepository } from './modules/posts/infrastructure/posts.repository';
import { PostsService } from './modules/posts/application/posts.service';
import { PostsQueryRepository } from './modules/posts/infrastructure/posts.query-repository';
import { PostsController } from './modules/posts/api/posts.controller';
import { CommentsController } from './modules/comments/api/comments.controller';
import { CommentsQueryRepository } from './modules/comments/infrastructure/comments.query-repository';
import { CommentsRepository } from './modules/comments/infrastructure/comments.repository';
import { CommentsService } from './modules/comments/application/comments.service';
import {
  Comment,
  CommentSchema,
} from './modules/comments/domain/comment.entity';
import { AppController } from './app.controller';
import { TestingController } from './modules/testing/testing.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

const usersProviders: Provider[] = [
  UsersRepository,
  UsersService,
  UsersQueryRepository,
];
const blogsProviders: Provider[] = [
  BlogsRepository,
  BlogsService,
  BlogsQueryRepository,
];
const postsProviders: Provider[] = [
  PostsRepository,
  PostsService,
  PostsQueryRepository,
];
const commentsProviders: Provider[] = [
  CommentsRepository,
  CommentsService,
  CommentsQueryRepository,
];

@Module({
  // Регистрация модулей
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/swagger'
    }),
    MongooseModule.forRoot(appSettings.api.MONGO_CONNECTION_URI),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  // Регистрация провайдеров
  providers: [
    ...usersProviders,
    ...blogsProviders,
    ...postsProviders,
    ...commentsProviders,
    AuthService,
    {
      provide: AppSettings,
      useValue: appSettings,
    },
  ],
  // Регистрация контроллеров
  controllers: [
    TestingController,
    AppController,
    UsersController,
    BlogsController,
    PostsController,
    CommentsController,
  ],
})
export class AppModule { }
