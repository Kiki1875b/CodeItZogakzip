import { Request, Response } from "express";
import { CommentUpdateDto, ReturnCreateCommentDto, SendCreateCommentDto } from "../DTO/commentDTO";
import { CommentService } from "../service/testCommentService";


export class CommentController{
  constructor(private commentService : CommentService){}

  async createComment(req: Request, res : Response){
    try{
      const postId = parseInt(req.params.postId, 10);
      const {nickname, content, password} = req.body;
      const commentDTO = new SendCreateCommentDto(postId, nickname, content, password);

      console.log(commentDTO);
      const newComment = await this.commentService.createComment(commentDTO);
      console.log(newComment);
      const responseDto = new ReturnCreateCommentDto(
        newComment.commentId,
        newComment.nickname,
        newComment.content,
        newComment.createdAt
      );
      res.status(200).json(responseDto);

    }catch(error){
      throw {status: 404, message: "error"}
    }
  }


  async getComments(req:Request, res:Response){
    const postId = parseInt(req.params.postId, 10);
    try{
      const page = parseInt(req.query.page as string, 10) || 1; 
      const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
      const commentList = await this.commentService.getComments(postId, page, pageSize);

      res.status(200).json(commentList);
    }catch(error){
      res.status(404).json(error);
    }
  }

  async updateComment(req: Request, res: Response){
    const commentId = parseInt(req.params.commentId, 10);
    const {nickname, content, password} = req.body;
    try{
      const updateDto = new CommentUpdateDto(commentId, nickname, content, password);
      const updatedComment = await this.commentService.updateComment(updateDto);

      res.status(200).json(updatedComment);
    }catch(error){
      res.status(404).json(error);
    }
  }


  async deleteComment(req: Request, res: Response){
    const commentId = parseInt(req.params.commentId, 10);
    const {password} = req.body;
    try{
      await this.commentService.deleteComment(commentId, password);
      res.status(200).json({message : "successfully deleted comment"})
    }catch(error){
      res.status(404).json(error);
    }
  }
}