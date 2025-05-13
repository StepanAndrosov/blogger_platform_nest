import { Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppSettings, appSettings } from './settings/app-settings';
import { UsersRepository } from './features/users/infrastructure/users.repository';
import { UsersService } from './features/users/application/users.service';
import { UsersQueryRepository } from './features/users/infrastructure/users.query-repository';
import { User, UserSchema } from './features/users/domain/user.entity';
import { UsersController } from './features/users/api/users.controller';
import { AuthService } from './features/auth/application/auth.service';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { BlogsRepository } from './features/blogs/infrastructure/blogs.repository';
import { BlogsService } from './features/blogs/application/blogs.service';
import { BlogsQueryRepository } from './features/blogs/infrastructure/blogs.query-repository';
import { Blog, BlogSchema } from './features/blogs/domain/blog.entity';
import { Post, PostSchema } from './features/posts/domain/post.entity';
import { PostsRepository } from './features/posts/infrastructure/posts.repository';
import { PostsService } from './features/posts/application/posts.service';
import { PostsQueryRepository } from './features/posts/infrastructure/posts.query-repository';
import { PostsController } from './features/posts/api/posts.controller';
import { CommentsController } from './features/comments/api/comments.controller';
import { CommentsQueryRepository } from './features/comments/infrastructure/comments.query-repository';
import { CommentsRepository } from './features/comments/infrastructure/comments.repository';
import { CommentsService } from './features/comments/application/comments.service';
import {
  Comment,
  CommentSchema,
} from './features/comments/domain/comment.entity';
import { AppController } from './app.controller';
import { TestingController } from './features/testing/testing.controller';
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
