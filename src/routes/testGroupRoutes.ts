import express from 'express';
import { GroupController } from '../controllers/testGroupController';
import { GroupService } from '../service/testGroupService';
import { BadgeService } from '../service/testBadgeService';
import { GroupRepository } from '../repositories/GroupRepository';
import { BadgeRepository } from '../repositories/BadgeRepository';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const groupRepository = new GroupRepository(prisma);
const badgeRepository = new BadgeRepository(prisma);
const badgeService = new BadgeService(badgeRepository, groupRepository);
const groupService = new GroupService(groupRepository, badgeRepository);
const groupController = new GroupController(groupService);

router.post('/groups', groupController.createGroup.bind(groupController));
router.get('/groups', groupController.getGroups.bind(groupController));
router.put('/groups/:GID', groupController.updateGroup.bind(groupController));
router.delete('/groups/:GID', groupController.deleteGroup.bind(groupController));
router.get('/groups/:GID', groupController.getGroupInfo.bind(groupController));
router.post('/groups/:GID/like', groupController.groupLike.bind(groupController));
router.get('/groups/:GID/is-public', groupController.isGroupPublic.bind(groupController));
router.post('/groups/:GID/verify-password', groupController.verifyGroupPassword.bind(groupController));

export default router;