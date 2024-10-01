"use strict";
// src/controllers/postController.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsPublic = exports.likePost = exports.verifyPassword = exports.getPostDetail = exports.deletePost = exports.updatePost = exports.getPosts = exports.createPost = exports.getPostsByGroup = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const getPostsByGroup = async (req, res) => {
    const { groupId } = req.params;
    try {
        const posts = await prisma_1.default.post.findMany({
            where: {
                GID: parseInt(groupId, 10),
            },
            orderBy: {
                CreatedDate: 'desc',
            },
            select: {
                PostID: true,
                Nickname: true,
                Title: true,
                Content: true,
                IsPublic: true,
                LikeCount: true,
                CommentCount: true,
                CreatedDate: true,
            },
        });
        res.status(200).json(posts);
    }
    catch (error) {
        console.error('게시글 목록 조회 오류:', error);
        res.status(500).json({ error: '게시글 목록 조회에 실패했습니다.' });
    }
};
exports.getPostsByGroup = getPostsByGroup;
// 게시글 등록
const createPost = async (req, res) => {
    const { groupId } = req.params;
    const { Nickname, Title, Content, IsPublic, PPassword, Image, Location, MemoryMoment } = req.body;
    if (!Nickname || !Title || !Content || typeof IsPublic !== 'boolean') {
        return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
    }
    try {
        const post = await prisma_1.default.post.create({
            data: {
                GID: parseInt(groupId, 10),
                Nickname,
                Title,
                Content,
                IsPublic,
                PPassword: PPassword || '',
                Image: Image || null,
                Location: Location || null,
                MemoryMoment: MemoryMoment ? new Date(MemoryMoment) : new Date(),
            },
        });
        res.status(201).json(post);
    }
    catch (error) {
        console.error('게시글 생성 오류:', error);
        res.status(500).json({ error: '게시글 생성에 실패했습니다.' });
    }
};
exports.createPost = createPost;
// 게시글 목록 조회
const getPosts = async (req, res) => {
    const { groupId } = req.params;
    try {
        const posts = await prisma_1.default.post.findMany({
            where: {
                GID: parseInt(groupId, 10),
            },
            orderBy: {
                CreatedDate: 'desc',
            },
            select: {
                PostID: true,
                Nickname: true,
                Title: true,
                Content: true,
                IsPublic: true,
                LikeCount: true,
                CommentCount: true,
                CreatedDate: true,
            },
        });
        res.status(200).json(posts);
    }
    catch (error) {
        console.error('게시글 목록 조회 오류:', error);
        res.status(500).json({ error: '게시글 목록 조회에 실패했습니다.' });
    }
};
exports.getPosts = getPosts;
// 게시글 수정
const updatePost = async (req, res) => {
    const { postId } = req.params;
    const { Title, Content, IsPublic, PPassword, Image, Location, MemoryMoment } = req.body;
    try {
        const existingPost = await prisma_1.default.post.findUnique({
            where: { PostID: parseInt(postId, 10) },
        });
        if (!existingPost) {
            return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
        }
        const updatedPost = await prisma_1.default.post.update({
            where: { PostID: parseInt(postId, 10) },
            data: {
                Title: Title || existingPost.Title,
                Content: Content || existingPost.Content,
                IsPublic: typeof IsPublic === 'boolean' ? IsPublic : existingPost.IsPublic,
                PPassword: PPassword !== undefined ? PPassword : existingPost.PPassword,
                Image: Image !== undefined ? Image : existingPost.Image,
                Location: Location !== undefined ? Location : existingPost.Location,
                MemoryMoment: MemoryMoment ? new Date(MemoryMoment) : existingPost.MemoryMoment,
            },
        });
        res.status(200).json(updatedPost);
    }
    catch (error) {
        console.error('게시글 수정 오류:', error);
        res.status(500).json({ error: '게시글 수정에 실패했습니다.' });
    }
};
exports.updatePost = updatePost;
// 게시글 삭제
const deletePost = async (req, res) => {
    const { postId } = req.params;
    try {
        const existingPost = await prisma_1.default.post.findUnique({
            where: { PostID: parseInt(postId, 10) },
        });
        if (!existingPost) {
            return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
        }
        await prisma_1.default.post.delete({
            where: { PostID: parseInt(postId, 10) },
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('게시글 삭제 오류:', error);
        res.status(500).json({ error: '게시글 삭제에 실패했습니다.' });
    }
};
exports.deletePost = deletePost;
// 게시글 상세 정보 조회
const getPostDetail = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await prisma_1.default.post.findUnique({
            where: { PostID: parseInt(postId, 10) },
            include: {
                comments: {
                    select: {
                        CommentID: true,
                        Nickname: true,
                        Content: true,
                        CreatedDate: true,
                    },
                    orderBy: { CreatedDate: 'asc' },
                },
                postTags: {
                    include: {
                        tag: {
                            select: { TagID: true, Name: true },
                        },
                    },
                },
            },
        });
        if (!post) {
            return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
        }
        res.status(200).json(post);
    }
    catch (error) {
        console.error('게시글 상세 정보 조회 오류:', error);
        res.status(500).json({ error: '게시글 상세 정보 조회에 실패했습니다.' });
    }
};
exports.getPostDetail = getPostDetail;
// 게시글 조회 권한 확인
const verifyPassword = async (req, res) => {
    const { postId } = req.params;
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ error: '비밀번호가 필요합니다.' });
    }
    try {
        const post = await prisma_1.default.post.findUnique({
            where: { PostID: parseInt(postId, 10) },
        });
        if (!post) {
            return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
        }
        if (post.IsPublic) {
            return res.status(200).json({ access: true });
        }
        if (post.PPassword === password) {
            return res.status(200).json({ access: true });
        }
        return res.status(403).json({ access: false, error: '비밀번호가 일치하지 않습니다.' });
    }
    catch (error) {
        console.error('게시글 조회 권한 확인 오류:', error);
        res.status(500).json({ error: '게시글 조회 권한 확인에 실패했습니다.' });
    }
};
exports.verifyPassword = verifyPassword;
// 게시글 공감하기
const likePost = async (req, res) => {
    const { postId } = req.params;
    try {
        const updatedPost = await prisma_1.default.post.update({
            where: { PostID: parseInt(postId, 10) },
            data: {
                LikeCount: {
                    increment: 1,
                },
            },
            select: {
                LikeCount: true,
            },
        });
        res.status(200).json({ likes: updatedPost.LikeCount });
    }
    catch (error) {
        console.error('게시글 공감하기 오류:', error);
        res.status(500).json({ error: '게시글 공감하기에 실패했습니다.' });
    }
};
exports.likePost = likePost;
// 게시글 공개 여부 확인
const checkIsPublic = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await prisma_1.default.post.findUnique({
            where: { PostID: parseInt(postId, 10) },
            select: { IsPublic: true },
        });
        if (!post) {
            return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
        }
        res.status(200).json({ isPublic: post.IsPublic });
    }
    catch (error) {
        console.error('게시글 공개 여부 확인 오류:', error);
        res.status(500).json({ error: '게시글 공개 여부 확인에 실패했습니다.' });
    }
};
exports.checkIsPublic = checkIsPublic;
