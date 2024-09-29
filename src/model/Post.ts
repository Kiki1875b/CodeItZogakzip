import { PrismaClient } from "@prisma/client";

export class Post{
  constructor(
    public postId : number,
    public groupId : number,
    public nickname: string,
    public title: string,
    public imageUrl: string | null,
    public content: string,
    public location: string | null,
    public memoryMoment: Date,
    public isPublic: boolean,
    public postPassword: string,
    public createdAt: Date,
    public likeCount: number,
    public commentCount: number,
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
      prismaPost.CommentCount
    );
  }
}