import { GroupRepository } from "../repositories/GroupRepository";
import { CommentRepository } from "../repositories/CommentRepository";
import { Group } from "../model/Group";
import { Comment } from "../model/Comment";
import { CommentListDto, CommentUpdateDto, ReturnCreateCommentDto, SendCreateCommentDto } from "../DTO/commentDTO";

export class CommentService{
  constructor(private commentRepository: CommentRepository){}

  async createComment(commentDto: SendCreateCommentDto): Promise<Comment>{
    try{
      return this.commentRepository.createComment({
      PostID : commentDto.postId,
      Nickname : commentDto.nickname,
      Content : commentDto.content,
      Password: commentDto.password,
    });
    }catch(error){
      throw {status: 404, message: "error creating comment"}
    }
  }

  async getComments(postId: number, currentPage: number, pageSize: number): Promise<CommentListDto>{
    try{
      const {comments, totalCount} = await this.commentRepository.findCommentsByPostId({
        postId : postId,
        page: currentPage,
        pageSize : pageSize
      });

      const commentDto = await Promise.all(comments.map(async (comment)=>{
        return new ReturnCreateCommentDto(comment.commentId, comment.nickname, comment.content, comment.createdAt);
      }))
      const totalPages = totalCount / pageSize;
      return new CommentListDto(currentPage, totalPages, totalCount, commentDto);
    }catch{
      throw {status: 404, message: "error in service"}
    }
  }

  async updateComment(updateDto : CommentUpdateDto): Promise<ReturnCreateCommentDto>{
    try{
      const comment = await this.commentRepository.getComment(updateDto.commentId);
      if(!comment){
        throw {status: 404, message: "could not find comment"}
      }

      if(updateDto.password !== comment.password){
        throw {status: 404, message: "invalid password"}
      }

      const updateData: any = {};

      if(updateDto.nickname) updateData.Nickname = updateDto.nickname;
      if(updateDto.content) updateData.Content = updateDto.content;
      if(updateDto.password) updateData.Password = updateDto.password;

      const updatedComment = await this.commentRepository.update(updateDto.commentId, updateData);
      
      return updatedComment;

    }catch(error){
      throw {status: 404, message: "error in service"}
    }
  }

  async deleteComment(commentId: number, password: string): Promise<void>{
    try{
      const comment = await this.commentRepository.findCommentById(commentId);

      if(!comment){
        throw { status: 404, message: "comment does not exist"}
      }

      if(comment.password !== password){
        throw {status: 404, message : "invalid password, cannot delete"}
      }

      await this.commentRepository.delete(commentId);
    }catch(error){
      throw {status: 404, message: "error while deleting inservice"}
    }
  }
}