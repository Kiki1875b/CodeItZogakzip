"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const commentDTO_1 = require("../DTO/commentDTO");
class CommentController {
    constructor(commentService) {
        this.commentService = commentService;
    }
    async createComment(req, res) {
        try {
            const postId = parseInt(req.params.postId, 10);
            const { nickname, content, password } = req.body;
            const commentDTO = new commentDTO_1.SendCreateCommentDto(postId, nickname, content, password);
            console.log(commentDTO);
            const newComment = await this.commentService.createComment(commentDTO);
            console.log(newComment);
            const responseDto = new commentDTO_1.ReturnCreateCommentDto(newComment.commentId, newComment.nickname, newComment.content, newComment.createdAt);
            res.status(200).json(responseDto);
        }
        catch (error) {
            throw { status: 404, message: "error" };
        }
    }
    async getComments(req, res) {
        const postId = parseInt(req.params.postId, 10);
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const pageSize = parseInt(req.query.pageSize, 10) || 10;
            const commentList = await this.commentService.getComments(postId, page, pageSize);
            res.status(200).json(commentList);
        }
        catch (error) {
            res.status(404).json(error);
        }
    }
    async updateComment(req, res) {
        const commentId = parseInt(req.params.commentId, 10);
        const { nickname, content, password } = req.body;
        try {
            const updateDto = new commentDTO_1.CommentUpdateDto(commentId, nickname, content, password);
            const updatedComment = await this.commentService.updateComment(updateDto);
            res.status(200).json(updatedComment);
        }
        catch (error) {
            res.status(404).json(error);
        }
    }
    async deleteComment(req, res) {
        const commentId = parseInt(req.params.commentId, 10);
        const { password } = req.body;
        try {
            await this.commentService.deleteComment(commentId, password);
            res.status(200).json({ message: "successfully deleted comment" });
        }
        catch (error) {
            res.status(404).json(error);
        }
    }
}
exports.CommentController = CommentController;
