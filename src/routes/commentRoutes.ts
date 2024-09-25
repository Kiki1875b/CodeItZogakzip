import { Router } from 'express';
import {
  createComment,
  getCommentsByPostId,
  deleteComment,
} from '../controllers/commentController';

const router = Router();

router.post('/', createComment);
router.get('/post/:PostID', getCommentsByPostId);
router.delete('/:CommentID', deleteComment);

export default router;
