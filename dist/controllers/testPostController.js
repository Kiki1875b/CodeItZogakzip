"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const postDTO_1 = require("../DTO/postDTO");
class PostController {
    constructor(groupService, postService) {
        this.groupService = groupService;
        this.postService = postService;
    }
    async createPost(req, res) {
        console.log(req.body);
        try {
            const groupId = parseInt(req.params.GID, 10);
            const { nickname, title, content, isPublic, postPassword, gPassword, tags, location, moment, } = req.body;
            const imageFile = req.file;
            const imageUrl = imageFile ? `/uploads/posts/main/${imageFile.filename}` : undefined;
            const momentDate = new Date(moment);
            let tagArray;
            try {
                tagArray = typeof tags === 'string' ? JSON.parse(tags) : tags;
            }
            catch (error) {
                tagArray = [];
            }
            const isPublicBool = isPublic === 'true';
            const postDto = new postDTO_1.CreatePostDto(nickname, title, content, postPassword, tagArray, location, momentDate, isPublicBool, imageUrl);
            console.log(postDto);
            const newPost = await this.postService.createPost(groupId, postDto);
            console.log(newPost);
            if (!newPost)
                throw { error: 404, message: "invalid" };
            res.status(200).json({
                id: newPost.postId,
                groupId: groupId,
                nickname: newPost.nickname,
                title: newPost.title,
                content: newPost.content,
                imageUrl: newPost.imageUrl,
                tags: newPost.tags,
                location: newPost.location,
                moment: newPost.memoryMoment,
                isPublic: newPost.isPublic,
                likeCount: newPost.likeCount,
                commentCount: newPost.commentCount,
                createdAt: newPost.createdAt
            });
        }
        catch (error) {
            console.log(error);
            res.status(400).json({ message: "잘못된 요청입니다." });
        }
    }
    async getPosts(req, res) {
        const groupId = parseInt(req.params.GID, 10);
        try {
            const queryDto = new postDTO_1.PostQueryDto(req.query);
            const postListResponse = await this.postService.getPosts(queryDto, groupId);
            res.status(200).json(postListResponse);
        }
        catch {
            res.status(400).json({ message: "잘못된 요청입니다" });
        }
    }
    async updatePost(req, res) {
        const postId = parseInt(req.params.postId, 10);
        const { nickname, title, content, postPassword, imageUrl, tags, location, moment, isPublic } = req.body;
        try {
            const updateDto = new postDTO_1.PostUpdateDto(nickname, title, content, tags, location, moment, isPublic, imageUrl);
            const updatedPost = await this.postService.updatePost(updateDto, postId, postPassword);
            res.status(200).json(updatedPost);
        }
        catch (error) {
            res.status(404).json(error);
        }
    }
    async deletePost(req, res) {
        try {
            const postId = parseInt(req.params.postId, 10);
            const { postPassword } = req.body;
            await this.postService.deletePost(postId, postPassword);
            res.status(200).json({ message: "성공적으로 삭제" });
        }
        catch (error) {
            res.status(404).json(error);
        }
    }
    async postDetail(req, res) {
        try {
            const postId = parseInt(req.params.postId, 10);
            const post = await this.postService.getPostDetail(postId);
            res.status(200).json(post);
        }
        catch (error) {
            res.status(404).json(error);
        }
    }
    async verifyPassword(req, res) {
        try {
            const postId = parseInt(req.params.postId, 10);
            const { password } = req.body;
            const verification = await this.postService.verifyPassword(postId, password);
            if (!verification) {
                throw { status: 404, message: "verification failed" };
            }
            res.status(200).json(verification);
        }
        catch (error) {
            res.status(404).json({ error });
        }
    }
    async postLike(req, res) {
        try {
            const postId = parseInt(req.params.postId, 10);
            await this.postService.postLike(postId);
            res.status(200).json({ message: "게시글 공감하기 성공" });
        }
        catch {
            res.status(404).json({ message: "존재하지 않습니다." });
        }
    }
    async isPublic(req, res) {
        try {
            const postId = parseInt(req.params.postId, 10);
            const isPublic = await this.postService.isPublic(postId);
            res.status(200).json(isPublic);
        }
        catch (error) {
            res.status(404).json(error);
        }
    }
}
exports.PostController = PostController;
