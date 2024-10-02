"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRepository = void 0;
const commentDTO_1 = require("../DTO/commentDTO");
const Comment_1 = require("../model/Comment");
class CommentRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getComment(commentId) {
        try {
            const comment = await this.prisma.comment.findUnique({ where: { CommentID: commentId } });
            return Comment_1.Comment.fromPrisma(comment);
        }
        catch (error) {
            throw { status: 404, message: "error while getting comment" };
        }
    }
    async update(commentId, data) {
        try {
            const newComment = await this.prisma.comment.update({
                where: { CommentID: commentId },
                data: data,
            });
            return new commentDTO_1.ReturnCreateCommentDto(commentId, newComment.Nickname, newComment.Content, newComment.CreatedDate);
        }
        catch (error) {
            throw { status: 404, message: "error in rep" };
        }
    }
    async createComment(commentData) {
        try {
            const comment = await this.prisma.comment.create({ data: commentData });
            return Comment_1.Comment.fromPrisma(comment);
        }
        catch (error) {
            console.log(error);
            throw { status: 404, messsage: "" };
        }
    }
    async findCommentsByPostId(params) {
        try {
            const { postId, page, pageSize } = params;
            const offset = (page - 1) * pageSize;
            const [comments, totalCount] = await Promise.all([
                this.prisma.comment.findMany({
                    where: { PostID: postId },
                    skip: offset,
                    take: pageSize,
                    orderBy: { CreatedDate: 'desc' }
                }),
                this.prisma.comment.count({ where: { PostID: postId } })
            ]);
            return {
                comments: comments.map(Comment_1.Comment.fromPrisma),
                totalCount
            };
        }
        catch (error) {
            throw { status: 404, message: "error in rep" };
        }
    }
    async findCommentById(commentId) {
        try {
            const comment = this.prisma.comment.findUnique({
                where: { CommentID: commentId }
            });
            return Comment_1.Comment.fromPrisma(comment);
        }
        catch (error) {
            throw { status: 404, message: "error fetching comment" };
        }
    }
    async delete(commentId) {
        try {
            await this.prisma.comment.delete({ where: { CommentID: commentId } });
        }
        catch {
            throw { status: 404, message: "error while deleting" };
        }
    }
}
exports.CommentRepository = CommentRepository;
