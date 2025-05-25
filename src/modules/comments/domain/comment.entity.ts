import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { StatusLike } from '../api/models/output/comment.output.model';

@Schema()
class CommentatorInfo {
  @Prop({ type: String, require: true })
  userId: string;
  @Prop({ type: String, require: true })
  userLogin: string;
}

@Schema()
class LikesInfo {
  @Prop({ type: String, require: true })
  likesCount: number;
  @Prop({ type: String, require: true })
  dislikesCount: number;
  @Prop({ type: String, require: true })
  myStatus: StatusLike;
}

@Schema()
export class Comment {
  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, required: true })
  postId: string;

  @Prop({ type: Object, required: true })
  commentatorInfo: CommentatorInfo;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Object, required: true })
  likesInfo: LikesInfo;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.loadClass(Comment);

// Types
export type CommentDocument = HydratedDocument<Comment>;

export type CommentModelType = Model<CommentDocument>;
