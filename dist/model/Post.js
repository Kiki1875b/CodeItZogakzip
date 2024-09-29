"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
class Post {
    constructor(postId, groupId, nickname, title, imageUrl, content, location, memoryMoment, isPublic, postPassword, createdAt, likeCount, commentCount) {
        this.postId = postId;
        this.groupId = groupId;
        this.nickname = nickname;
        this.title = title;
        this.imageUrl = imageUrl;
        this.content = content;
        this.location = location;
        this.memoryMoment = memoryMoment;
        this.isPublic = isPublic;
        this.postPassword = postPassword;
        this.createdAt = createdAt;
        this.likeCount = likeCount;
        this.commentCount = commentCount;
    }
    static fromPrisma(prismaPost) {
        return new Post(prismaPost.PostID, prismaPost.GID, prismaPost.Nickname, prismaPost.Title, prismaPost.Image, prismaPost.Content, prismaPost.Location, prismaPost.memoryMoment, prismaPost.IsPublic, prismaPost.PPassword, prismaPost.CreatedDate, prismaPost.LikeCount, prismaPost.CommentCount);
    }
}
exports.Post = Post;
