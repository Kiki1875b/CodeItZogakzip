"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostUpdateDto = exports.PostPublicDto = exports.PostListResponseDto = exports.PostInfoResponseDto = exports.PostQueryDto = exports.CreatePostDto = void 0;
class CreatePostDto {
    constructor(nickname, title, content, postPassword, tags, location, moment, isPublic, imageUrl) {
        this.nickname = nickname;
        this.title = title;
        this.content = content;
        this.postPassword = postPassword;
        this.imageUrl = imageUrl;
        this.tags = tags;
        this.location = location;
        this.moment = moment;
        this.isPublic = isPublic;
    }
}
exports.CreatePostDto = CreatePostDto;
class PostQueryDto {
    constructor(query) {
        this.page = Number(query.page) || 1;
        this.pageSize = Number(query.pageSize) || 10;
        this.sortBy = query.sortBy || 'latest';
        this.keyword = query.keyword || '';
        this.isPublic = query.isPublic === 'true';
    }
}
exports.PostQueryDto = PostQueryDto;
class PostInfoResponseDto {
    constructor(post, tags) {
        this.id = post.postId;
        this.nickname = post.nickname;
        this.title = post.title;
        this.imageUrl = post.imageUrl;
        this.tags = tags;
        this.location = post.location;
        this.moment = new Date(post.memoryMoment);
        this.isPublic = post.isPublic;
        this.likeCount = post.likeCount;
        this.commentCount = post.commentCount;
        this.createdAt = new Date(post.createdAt);
    }
}
exports.PostInfoResponseDto = PostInfoResponseDto;
class PostListResponseDto {
    constructor(currentPage, totalPages, totalItemCount, data) {
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.totalItemCount = totalItemCount;
        this.data = data;
    }
}
exports.PostListResponseDto = PostListResponseDto;
class PostPublicDto {
    constructor(id, isPublic) {
        this.id = id;
        this.isPublic = isPublic;
    }
}
exports.PostPublicDto = PostPublicDto;
class PostUpdateDto {
    constructor(nickname, title, content, tags, location, moment, isPublic, imageUrl) {
        this.nickname = nickname;
        this.title = title;
        this.content = content;
        this.tags = tags;
        this.location = location;
        this.moment = moment;
        this.isPublic = isPublic;
        this.imageUrl = imageUrl;
    }
}
exports.PostUpdateDto = PostUpdateDto;
