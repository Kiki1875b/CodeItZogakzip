"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const testGroupController_1 = require("../controllers/testGroupController");
const testGroupService_1 = require("../service/testGroupService");
const testBadgeService_1 = require("../service/testBadgeService");
const GroupRepository_1 = require("../repositories/GroupRepository");
const BadgeRepository_1 = require("../repositories/BadgeRepository");
const PostRepository_1 = require("../repositories/PostRepository");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const uploadDir = path_1.default.join(__dirname, '../uploads/groups/main/');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
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
const prisma = new client_1.PrismaClient();
const groupRepository = new GroupRepository_1.GroupRepository(prisma);
const badgeRepository = new BadgeRepository_1.BadgeRepository(prisma);
const postRepository = new PostRepository_1.PostRepository(prisma);
const badgeService = new testBadgeService_1.BadgeService(badgeRepository, groupRepository, postRepository);
const groupService = new testGroupService_1.GroupService(groupRepository, badgeRepository, badgeService);
const groupController = new testGroupController_1.GroupController(groupService, badgeService);
router.post('/groups', (0, multer_1.default)({ storage }).single('file'), groupController.createGroup.bind(groupController));
router.get('/groups', groupController.getGroups.bind(groupController));
router.put('/groups/:GID', groupController.updateGroup.bind(groupController));
router.delete('/groups/:GID', groupController.deleteGroup.bind(groupController));
router.get('/groups/:GID', groupController.getGroupInfo.bind(groupController));
router.post('/groups/:GID/like', groupController.groupLike.bind(groupController));
router.get('/groups/:GID/is-public', groupController.isGroupPublic.bind(groupController));
router.post('/groups/:GID/verify-password', groupController.verifyGroupPassword.bind(groupController));
exports.default = router;
