"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const groupController_1 = require("../controllers/groupController");
const createGroupDTO_1 = require("../DTO/createGroupDTO");
const router = express_1.default.Router();
router.post('/groups', async (req, res) => {
    try {
        const newGroup = await (0, groupController_1.createGroup)(req.body);
        res.status(201).json(newGroup);
    }
    catch (error) {
        res.status(400).json({ message: 'Error Creating Group' });
    }
});
router.get('/groups', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const sortBy = req.query.sortBy || 'latest';
        const keyword = req.query.keyword || '';
        const isPublic = true;
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
        res.status(200).json({ groupInfo });
    }
    catch (error) {
        res.status(404).json({ message: "Error Fetching Badges" });
    }
});
exports.default = router;
