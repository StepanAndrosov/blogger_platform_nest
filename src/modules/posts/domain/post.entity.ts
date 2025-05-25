import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { StatusLike } from '../api/models/output/post.output.model';

@Schema()
export class NewLike {
  @Prop({ type: String, require: true })
  addedAt: string;
  @Prop({ type: String, require: true })
  userId: string;
  @Prop({ type: String, require: true })
  login: string;
}

@Schema()
class ExtendedLikesInfo {
  @Prop({ type: Number, require: true })
  likesCount: number;
  @Prop({ type: Number, require: true })
  dislikesCount: number;
  @Prop({ type: String, require: true })
  myStatus: StatusLike;
  @Prop({ type: Array, default: [] })
  newestLikes: NewLike[];
}

@Schema()
export class Post {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  shortDescription: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, required: true })
  blogId: string;

  @Prop({ type: String, required: true })
  blogName: string;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Object, required: true })
  extendedLikesInfo: ExtendedLikesInfo;
}

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.loadClass(Post);

// Types
export type PostDocument = HydratedDocument<Post>;

export type PostModelType = Model<PostDocument>;
