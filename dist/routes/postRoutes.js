"use strict";
// src/routes/postRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const client_1 = require("@prisma/client");
const PostRepository_1 = require("../repositories/PostRepository");
const testPostController_1 = require("../controllers/testPostController");
const postService_1 = require("../service/postService");
const BadgeRepository_1 = require("../repositories/BadgeRepository");
const testBadgeService_1 = require("../service/testBadgeService");
const GroupRepository_1 = require("../repositories/GroupRepository");
const testGroupService_1 = require("../service/testGroupService");
const router = express_1.default.Router({ mergeParams: true });
const prisma = new client_1.PrismaClient();
const groupRepository = new GroupRepository_1.GroupRepository(prisma);
const badgeRepository = new BadgeRepository_1.BadgeRepository(prisma);
const postRepository = new PostRepository_1.PostRepository(prisma);
const badgeService = new testBadgeService_1.BadgeService(badgeRepository, groupRepository, postRepository);
const groupService = new testGroupService_1.GroupService(groupRepository, badgeRepository, badgeService);
const postService = new postService_1.PostService(postRepository, badgeService, groupRepository);
const postController = new testPostController_1.PostController(groupService, postService);
const uploadDir = path_1.default.join(__dirname, '../uploads/posts/main/');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        console.log(file.fieldname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        const uniqueFileName = uniqueSuffix + ext;
        cb(null, uniqueFileName);
    }
});
router.post('/', (0, multer_1.default)({ storage }).single('imageUrl'), postController.createPost.bind(postController));
router.get('/', postController.getPosts.bind(postController));
router.put('/:postId', postController.updatePost.bind(postController));
router.delete('/:postId', postController.deletePost.bind(postController));
router.get('/:postId', postController.postDetail.bind(postController));
// router.post('/:postId/verify-password', postController.verifyPassword.bind(postController));
router.post('/:postId/verify-password', postController.verifyPassword.bind(postController));
router.post('/verify-password', postController.verifyPassword.bind(postController));
router.post('/:postId/like', postController.postLike.bind(postController));
router.get('/:postId/is-public', postController.isPublic.bind(postController));
exports.default = router;
