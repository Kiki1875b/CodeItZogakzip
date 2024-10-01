// src/routes/postRoutes.ts

import express from 'express';
import {
  createPost,
  getPostsByGroup,
  getPosts,
  updatePost,
  deletePost,
  getPostDetail,
  verifyPassword,
  likePost,
  checkIsPublic,
} from '../controllers/postController';

const router = express.Router();

// 게시글 등록
router.post('/api/groups/:groupId/posts', createPost);

// 게시글 목록 조회
router.get('/api/groups/:groupId/posts', getPosts);

// 게시글 수정
router.put('/api/posts/:postId', updatePost);

// 게시글 삭제
router.delete('/api/posts/:postId', deletePost);

// 게시글 상세 정보 조회
router.get('/api/posts/:postId', getPostDetail);

// 게시글 조회 권한 확인
router.post('/api/posts/:postId/verify-password', verifyPassword);

// 게시글 공감하기
router.post('/api/posts/:postId/like', likePost);

// 게시글 공개 여부 확인
router.get('/api/posts/:postId/is-public', checkIsPublic);

export default router;
