
import express from 'express';
import { PrismaClient } from '@prisma/client';
import  {PostRepository} from '../repositories/PostRepository';
import { PostController } from '../controllers/testPostController';
import { PostService } from '../service/postService';

import { BadgeRepository } from '../repositories/BadgeRepository';
import { BadgeService } from '../service/testBadgeService';
import { GroupRepository } from '../repositories/GroupRepository';
import { GroupController } from '../controllers/testGroupController';
import { GroupService } from '../service/testGroupService';

import { CommentRepository } from '../repositories/CommentRepository';
import { CommentService } from '../service/testCommentService';
import { CommentController } from '../controllers/testCommentController';


const router = express.Router({ mergeParams: true });
const prisma = new PrismaClient();

const commentRepository = new CommentRepository(prisma);

const commentService = new CommentService(commentRepository);

const commentController = new CommentController(commentService);


router.post('/', commentController.createComment.bind(commentController));
router.get('/', commentController.getComments.bind(commentController));
router.put('/:commentId', commentController.updateComment.bind(commentController));
router.delete('/:commentId', commentController.deleteComment.bind(commentController));

export default router;