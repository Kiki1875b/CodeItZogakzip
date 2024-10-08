"use strict";
// src/routes/commentRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controllers/commentController");
const router = express_1.default.Router();
// 댓글 등록
router.post('/posts/:postId/comments', commentController_1.createComment);
// 댓글 목록 조회
router.get('/posts/:postId/comments', commentController_1.getComments);
// 댓글 수정
router.put('/:commentId', commentController_1.updateComment);
// 댓글 삭제
router.delete('/:commentId', commentController_1.deleteComment);
exports.default = router;
