import { PrismaClient } from "@prisma/client";
import { Tag } from "./Tag";

export class Post{
  constructor(
    public postId : number,
    public groupId : number,
    public nickname: string,
    public title: string,
    public imageUrl: string | null,
    public content: string,
    public location: string,
    public memoryMoment: Date,
    public isPublic: boolean,
    public postPassword: string,
    public createdAt: Date,
    public likeCount: number,
    public commentCount: number,
    public tags: Tag[] = []
  ) {}

  static fromPrisma(prismaPost: any): Post{
    return new Post(
      prismaPost.PostID,
      prismaPost.GID,
      prismaPost.Nickname,
      prismaPost.Title,
      prismaPost.Image,
      prismaPost.Content,
      prismaPost.Location,
      prismaPost.memoryMoment,
      prismaPost.IsPublic,
      prismaPost.PPassword,
      prismaPost.CreatedDate,
      prismaPost.LikeCount,
      prismaPost.CommentCount,
      prismaPost.postTags?.map((pt: any) => pt.tag.Name) || []
    );
  }
}