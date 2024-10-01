// src/routes/commentRoutes.ts

import express from 'express';
import {
  createComment,
  updateComment,
  deleteComment,
  getComments,
} from '../controllers/commentController';

const router = express.Router();

// 댓글 등록
router.post('/api/posts/:postId/comments', createComment);

// 댓글 수정
router.put('/api/comments/:commentId', updateComment);

// 댓글 삭제
router.delete('/api/comments/:commentId', deleteComment);

// 댓글 목록 조회
router.get('/api/posts/:postId/comments', getComments);

export default router;
