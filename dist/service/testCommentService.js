"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const commentDTO_1 = require("../DTO/commentDTO");
class CommentService {
    constructor(commentRepository) {
        this.commentRepository = commentRepository;
    }
    async createComment(commentDto) {
        try {
            return this.commentRepository.createComment({
                PostID: commentDto.postId,
                Nickname: commentDto.nickname,
                Content: commentDto.content,
                Password: commentDto.password,
            });
        }
        catch (error) {
            throw { status: 404, message: "error creating comment" };
        }
    }
    async getComments(postId, currentPage, pageSize) {
        try {
            const { comments, totalCount } = await this.commentRepository.findCommentsByPostId({
                postId: postId,
                page: currentPage,
                pageSize: pageSize
            });
            const commentDto = await Promise.all(comments.map(async (comment) => {
                return new commentDTO_1.ReturnCreateCommentDto(comment.commentId, comment.nickname, comment.content, comment.createdAt);
            }));
            const totalPages = totalCount / pageSize;
            return new commentDTO_1.CommentListDto(currentPage, totalPages, totalCount, commentDto);
        }
        catch {
            throw { status: 404, message: "error in service" };
        }
    }
    async updateComment(updateDto) {
        try {
            const comment = await this.commentRepository.getComment(updateDto.commentId);
            if (!comment) {
                throw { status: 404, message: "could not find comment" };
            }
            if (updateDto.password !== comment.password) {
                throw { status: 404, message: "invalid password" };
            }
            const updateData = {};
            if (updateDto.nickname)
                updateData.Nickname = updateDto.nickname;
            if (updateDto.content)
                updateData.Content = updateDto.content;
            if (updateDto.password)
                updateData.Password = updateDto.password;
            const updatedComment = await this.commentRepository.update(updateDto.commentId, updateData);
            return updatedComment;
        }
        catch (error) {
            throw { status: 404, message: "error in service" };
        }
    }
    async deleteComment(commentId, password) {
        try {
            const comment = await this.commentRepository.findCommentById(commentId);
            if (!comment) {
                throw { status: 404, message: "comment does not exist" };
            }
            if (comment.password !== password) {
                throw { status: 404, message: "invalid password, cannot delete" };
            }
            await this.commentRepository.delete(commentId);
        }
        catch (error) {
            throw { status: 404, message: "error while deleting inservice" };
        }
    }
}
exports.CommentService = CommentService;
