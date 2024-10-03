"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
class Comment {
    constructor(commentId, postId, nickname, content, password, createdAt) {
        this.commentId = commentId;
        this.postId = postId;
        this.nickname = nickname;
        this.content = content;
        this.password = password;
        this.createdAt = createdAt;
    }
    static fromPrisma(prismaComment) {
        return new Comment(prismaComment.CommentID, prismaComment.PostID, prismaComment.Nickname, prismaComment.Content, prismaComment.Password, prismaComment.CreatedDate);
    }
}
exports.Comment = Comment;
