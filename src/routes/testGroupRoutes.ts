import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { GroupController } from '../controllers/testGroupController';
import { GroupService } from '../service/testGroupService';
import { BadgeService } from '../service/testBadgeService';
import { GroupRepository } from '../repositories/GroupRepository';
import { BadgeRepository } from '../repositories/BadgeRepository';
import { PostRepository } from '../repositories/PostRepository';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads/groups/main/');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 파일이 저장될 디렉토리 지정
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // 고유한 파일 이름을 생성 (타임스탬프 + 랜덤 숫자)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // 파일 확장자 가져오기
    const uniqueFileName = uniqueSuffix + ext; // 고유한 파일 이름과 확장자 결합

    cb(null, uniqueFileName); // 고유한 파일 이름 설정
  }
});


const prisma = new PrismaClient();
const groupRepository = new GroupRepository(prisma);
const badgeRepository = new BadgeRepository(prisma);
const postRepository = new PostRepository(prisma);
const badgeService = new BadgeService(badgeRepository, groupRepository, postRepository);
const groupService = new GroupService(groupRepository, badgeRepository, badgeService);
const groupController = new GroupController(groupService, badgeService);

router.post('/groups', multer({storage}).single('imageURL'), groupController.createGroup.bind(groupController));
router.get('/groups', groupController.getGroups.bind(groupController));
router.put('/groups/:GID', groupController.updateGroup.bind(groupController));
router.delete('/groups/:GID', groupController.deleteGroup.bind(groupController));
router.get('/groups/:GID', groupController.getGroupInfo.bind(groupController));
router.post('/groups/:GID/like', groupController.groupLike.bind(groupController));
router.get('/groups/:GID/is-public', groupController.isGroupPublic.bind(groupController));
router.post('/groups/:GID/verify-password', groupController.verifyGroupPassword.bind(groupController));

export default router;