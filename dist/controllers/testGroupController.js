"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupController = void 0;
const createGroupDTO_1 = require("../DTO/createGroupDTO");
class GroupController {
    constructor(groupService, badgeService) {
        this.groupService = groupService;
        this.badgeService = badgeService;
    }
    async createGroup(req, res) {
        const { name, password, isPublic, introduction } = req.body;
        const imageFile = req.file;
        try {
            const imageUrl = imageFile ? `/uploads/groups/main/${imageFile.filename}` : undefined;
            const createGroupDto = new createGroupDTO_1.CreateGroupDto(name, password, isPublic, imageUrl, introduction);
            const newGroup = await this.groupService.createGroup(createGroupDto);
            res.status(200).json(newGroup);
        }
        catch (error) {
            res.status(400).json({ message: "그룹 생성 오류" });
        }
    }
    async getGroups(req, res) {
        try {
            const queryDto = new createGroupDTO_1.GroupQueryDto(req.query);
            const groupListResponse = await this.groupService.getGroups(queryDto);
            res.status(200).json(groupListResponse);
        }
        catch (error) {
            res.status(500).json({ message: "그룹 목록 실패" });
        }
    }
    async updateGroup(req, res) {
        const groupId = parseInt(req.params.GID, 10);
        const { name, password, imageUrl, isPublic, introduction } = req.body;
        try {
            const updateGroupDto = new createGroupDTO_1.UpdateGroupDto(name, isPublic, password, imageUrl, introduction);
            const updatedGroup = await this.groupService.updateGroup(groupId, updateGroupDto, password);
            res.status(200).json(updatedGroup);
        }
        catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    }
    async deleteGroup(req, res) {
        const groupId = parseInt(req.params.GID, 10);
        const { password } = req.body;
        try {
            await this.groupService.deleteGroup(groupId, password);
            res.status(200).json({ message: "성공적으로 삭제되었습니다." });
        }
        catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    }
    async getGroupInfo(req, res) {
        const groupId = parseInt(req.params.GID, 10);
        try {
            const groupInfo = await this.groupService.getGroupInfo(groupId);
            res.status(200).json({ groupInfo });
        }
        catch (error) {
            res.status(error.status || 404).json({ message: error.message });
        }
    }
    async groupLike(req, res) {
        const groupId = parseInt(req.params.GID, 10);
        try {
            await this.groupService.groupLike(groupId);
            return res.status(200).json({ message: "그룹 공감하기 성공" });
        }
        catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    }
    async isGroupPublic(req, res) {
        const groupId = parseInt(req.params.GID, 10);
        try {
            const isPublic = this.groupService.isGroupPublic(groupId);
            res.status(200).json({ id: groupId, isPublic });
        }
        catch (error) {
            res.status(error.status || 404).json({ message: error.message });
        }
    }
    async verifyGroupPassword(req, res) {
        const groupId = parseInt(req.params.GID, 10);
        const { password } = req.body;
        try {
            const isValid = await this.groupService.verifyGroupPassword(groupId, password);
            if (isValid) {
                res.status(200).json({ message: "비밀번호가 확인되었습니다." });
            }
            else {
                res.status(401).json({ message: "틀린 비밀번호입니다." });
            }
        }
        catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    }
}
exports.GroupController = GroupController;
