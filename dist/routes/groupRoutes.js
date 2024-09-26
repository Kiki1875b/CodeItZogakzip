"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const groupController_1 = require("../controllers/groupController");
const createGroupDTO_1 = require("../DTO/createGroupDTO");
const groupService_1 = require("../service/groupService");
const router = express_1.default.Router();
router.post('/groups', async (req, res) => {
    const { name, password, imageURL, isPublic, introduction } = req.body;
    try {
        const createGroupDto = new createGroupDTO_1.CreateGroupDto(name, password, isPublic, imageURL, introduction);
        const newGroup = await (0, groupController_1.createGroup)(createGroupDto);
        res.status(201).json(newGroup);
    }
    catch (error) {
        res.status(400).json({ message: 'Error Creating Group' });
    }
});
router.get('/groups', async (req, res) => {
    console.log("groups");
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const sortBy = req.query.sortBy || 'latest';
        const keyword = req.query.keyword || '';
        const isPublic = req.query.isPublic === undefined ? true : req.query.isPublic === 'true';
        const groups = await (0, groupController_1.getGroup)({ page, pageSize, sortBy, keyword, isPublic });
        res.status(200).json(groups);
    }
    catch (error) {
        res.status(400).json({ message: 'Error Fetching Groups', error });
    }
});
router.put('/groups/:GID', async (req, res) => {
    const groupId = parseInt(req.params.GID, 10);
    const { name, password, imageUrl, isPublic, introduction } = req.body;
    try {
        await (0, groupService_1.verifyGroupPassword)(groupId, password);
        const updateGroupDto = new createGroupDTO_1.UpdateGroupDto(name, isPublic, password, imageUrl, introduction);
        const updatedGroup = await (0, groupController_1.updateGroup)({ groupId, updateDto: updateGroupDto, inputPassword: password });
        res.status(200).json({
            id: updatedGroup.GID,
            name: updatedGroup.GName,
            imageUrl: updatedGroup.GImage,
            isPublic: updatedGroup.IsPublic,
            likeCount: updatedGroup.GLikes,
            badges: updatedGroup.GBadgeCount,
            postCount: updatedGroup.PostCount,
            createdAt: updatedGroup.CreatedDate,
            introduction: updatedGroup.GIntro
        });
    }
    catch (error) {
        const typedError = error;
        res.status(typedError.status || 500).json({ message: typedError.message });
    }
});
router.delete('/groups/:GID', async (req, res) => {
    const groupID = parseInt(req.params.GID, 10);
    const { password } = req.body;
    console.log(groupID);
    try {
        await (0, groupService_1.verifyGroupPassword)(groupID, password);
        await (0, groupController_1.deleteGroup)(groupID, password);
        res.status(200).json({ message: "성공적으로 삭제되었습니다." });
    }
    catch (error) {
        const typedError = error;
        res.status(typedError.status).json({ message: typedError.message });
    }
});
router.get('/groups/:GID', async (req, res) => {
    const groupId = parseInt(req.params.GID, 10);
    try {
        const groupInfo = await (0, groupController_1.getGroupInfo)(groupId);
        if (!groupInfo.isPublic) {
            return res.status(302).json({
                message: '비공게 그룹입니다.'
            });
        }
        res.status(200).json({ groupInfo });
    }
    catch (error) {
        res.status(404).json({ message: "Error Fetching Badges" });
    }
});
// 왜 필요한지 모르겠음
router.post('/groups/:GID/verify-password', async (req, res) => {
    const groupId = parseInt(req.params.GID, 10);
    const { password } = req.body;
    try {
        const group = await (0, groupService_1.findGroupById)(groupId);
        if (!group) {
            return res.status(404).json({ message: "존재하지 않는 그룹입니다." });
        }
        const isPasswordValid = group.GPassword === password;
        console.log(group.GPassword);
        console.log(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "틀린 비밀번호 입니다." });
        }
        return res.status(200).json({ message: "비밀번호가 확인되었습니다." });
    }
    catch (error) {
        res.status(500).json({ message: "오류 발생" });
    }
});
router.post('/groups/:GID/like', async (req, res) => {
    const groupId = parseInt(req.params.GID, 10);
    try {
        const result = await (0, groupController_1.groupLike)(groupId);
        return res.status(200).json(result);
    }
    catch (error) {
        const typedError = error;
        res.status(typedError.status).json({ message: typedError.message });
    }
});
router.get('/groups/:GID/is-public', async (req, res) => {
    const groupId = parseInt(req.params.GID, 10);
    try {
        const groupInfo = await (0, groupController_1.getGroupInfo)(groupId);
        return res.status(200).json({ id: groupId, isPublic: groupInfo.isPublic });
    }
    catch (error) {
        return res.status(404).json({ message: "Error Fetching Group Public Status" });
    }
});
exports.default = router;
