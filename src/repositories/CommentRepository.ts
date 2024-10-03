import { PrismaClient } from "@prisma/client";
import { ReturnCreateCommentDto, SendCreateCommentDto } from "../DTO/commentDTO";
import { Comment } from "../model/Comment";


export class CommentRepository{
  private prisma: PrismaClient;

  constructor(prisma : PrismaClient){
    this.prisma = prisma;
  }

  async getComment(commentId: number): Promise<Comment>{
    try{
      const comment = await this.prisma.comment.findUnique({where: {CommentID: commentId}});
      return Comment.fromPrisma(comment);
    }catch(error){
      throw {status: 404, message: "error while getting comment"}
    }
  }

  async update(commentId: number, data: any): Promise<ReturnCreateCommentDto>{
    try{
      const newComment = await this.prisma.comment.update({
        where: {CommentID : commentId},
        data: data,
      });

      return new ReturnCreateCommentDto(commentId, newComment.Nickname, newComment.Content, newComment.CreatedDate);
    }catch(error){
      throw {status: 404, message: "error in rep"}
    }
  }

  async createComment(commentData: any): Promise<Comment>{
    try{
      const comment = await this.prisma.comment.create({data : commentData});
      return Comment.fromPrisma(comment);
    }catch(error){
      console.log(error);
      throw { status: 404, messsage: ""}
    }
  }


  async findCommentsByPostId(params : {postId: number, page:number, pageSize : number}): Promise<{comments: Comment[], totalCount:number}>{
    try{
      const {postId, page, pageSize} = params;
      const offset = (page - 1) * pageSize;
      
      const [comments, totalCount] = await Promise.all([
        this.prisma.comment.findMany({
          where: {PostID: postId},
          skip: offset,
          take: pageSize,
          orderBy : {CreatedDate: 'desc'}
        }),
        this.prisma.comment.count({where: {PostID: postId}})
      ]);

      return {
        comments: comments.map(Comment.fromPrisma),
        totalCount
      }
    }catch(error){
      throw {status: 404, message: "error in rep"}
    }
  }

  async findCommentById(commentId: number): Promise<Comment>{
    try{
      const comment = this.prisma.comment.findUnique({
        where: {CommentID: commentId}
      });

      return Comment.fromPrisma(comment);
    }catch(error){
      throw {status: 404, message: "error fetching comment"}
    }
  }

  async delete(commentId: number): Promise<void>{
    try{
      await this.prisma.comment.delete({where: {CommentID: commentId}});
    }catch{
      throw {status: 404, message: "error while deleting"}
    }
  }
}