export class Comment {
  constructor(
    public commentId: number,
    public postId: number,
    public nickname: string,
    public content: string,
    public password: string,
    public createdAt: Date
  ) {}

  static fromPrisma(prismaComment: any): Comment {
    return new Comment(
      prismaComment.CommentID,
      prismaComment.PostID,
      prismaComment.Nickname,
      prismaComment.Content,
      prismaComment.Password,
      prismaComment.CreatedDate
    );
  }
}
