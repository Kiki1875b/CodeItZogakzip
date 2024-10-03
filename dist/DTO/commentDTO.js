"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentListDto = exports.CommentUpdateDto = exports.SendCreateCommentDto = exports.ReturnCreateCommentDto = void 0;
class ReturnCreateCommentDto {
    constructor(id, nickname, content, createdAt) {
        this.id = id;
        this.nickname = nickname;
        this.content = content;
        this.createdAt = createdAt;
    }
}
exports.ReturnCreateCommentDto = ReturnCreateCommentDto;
class SendCreateCommentDto {
    constructor(id, nickname, content, password) {
        this.postId = id;
        this.nickname = nickname;
        this.content = content;
        this.password = password;
    }
}
exports.SendCreateCommentDto = SendCreateCommentDto;
class CommentUpdateDto {
    constructor(id, nickname, content, password) {
        this.commentId = id;
        this.nickname = nickname;
        this.content = content;
        this.password = password;
    }
}
exports.CommentUpdateDto = CommentUpdateDto;
class CommentListDto {
    constructor(currentPage, totalPages, totalItemCount, data) {
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.totalItemCount = totalItemCount;
        this.data = data;
    }
}
exports.CommentListDto = CommentListDto;
