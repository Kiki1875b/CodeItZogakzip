import { Router } from 'express';
import { createPost, deletePost, getPosts, updatePost } from '../controllers/postController';

const router = Router();

// 게시글 등록 엔드포인트
router.post('/api/groups/:groupId/posts', createPost);

// 게시글 목록 조회 엔드포인트
router.get('/api/groups/:groupId/posts', getPosts);

// 게시글 수정 엔드포인트 추가
router.put('/api/posts/:postId', updatePost);

router.delete('/api/posts/:postId', deletePost);

// 다른 라우트들...

export default router;
