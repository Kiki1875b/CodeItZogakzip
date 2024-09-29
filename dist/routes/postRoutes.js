"use strict";
// src/routes/postRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = require("../controllers/postController");
const router = express_1.default.Router();
// 게시글 등록
router.post('/api/groups/:groupId/posts', postController_1.createPost);
// 게시글 목록 조회
router.get('/api/groups/:groupId/posts', postController_1.getPosts);
// 게시글 수정
router.put('/api/posts/:postId', postController_1.updatePost);
// 게시글 삭제
router.delete('/api/posts/:postId', postController_1.deletePost);
// 게시글 상세 정보 조회
router.get('/api/posts/:postId', postController_1.getPostDetail);
// 게시글 조회 권한 확인
router.post('/api/posts/:postId/verify-password', postController_1.verifyPassword);
// 게시글 공감하기
router.post('/api/posts/:postId/like', postController_1.likePost);
// 게시글 공개 여부 확인
router.get('/api/posts/:postId/is-public', postController_1.checkIsPublic);
exports.default = router;
