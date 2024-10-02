// src/routes/postRoutes.ts

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import  {PostRepository} from '../repositories/PostRepository';
import { PostController } from '../controllers/testPostController';
import { PostService } from '../service/postService';

import { BadgeRepository } from '../repositories/BadgeRepository';
import { BadgeService } from '../service/testBadgeService';
import { GroupRepository } from '../repositories/GroupRepository';
import { GroupService } from '../service/testGroupService';

const router = express.Router({ mergeParams: true });
const prisma = new PrismaClient();
const groupRepository = new GroupRepository(prisma);
const badgeRepository = new BadgeRepository(prisma);
const postRepository = new PostRepository(prisma);

const groupService = new GroupService(groupRepository, badgeRepository);
const postService = new PostService(postRepository);

const postController = new PostController(groupService, postService);


const uploadDir = path.join(__dirname, '../uploads/posts/main/');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 파일이 저장될 디렉토리 지정
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // 파일 이름을 고유하게 생성
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // 원본 파일 이름과 고유한 접미사를 결합
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});


router.post('/', multer({storage}).single('file'), postController.createPost.bind(postController));
router.get('/', postController.getPosts.bind(postController));

router.put('/:postId', postController.updatePost.bind(postController));
router.delete('/:postId', postController.deletePost.bind(postController));
router.get('/:postId', postController.postDetail.bind(postController));
router.post('/:postId/verify-password', postController.verifyPassword.bind(postController));
router.post('/:postId/like',postController.postLike.bind(postController));
router.get('/:postId/is-public', postController.isPublic.bind(postController));


export default router;
