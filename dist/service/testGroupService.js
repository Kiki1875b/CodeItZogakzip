"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupService = void 0;
const createGroupDTO_1 = require("../DTO/createGroupDTO");
class GroupService {
    constructor(groupRepository, badgeRepository, badgeService) {
        this.groupRepository = groupRepository;
        this.badgeRepository = badgeRepository;
        this.badgeService = badgeService;
    }
    async createGroup(groupData) {
        console.log(typeof groupData.IsPublic);
        const newGroup = await this.groupRepository.create({
            GName: groupData.GName,
            GImage: groupData.GImage,
            IsPublic: groupData.IsPublic,
            GIntro: groupData.GIntro,
            GPassword: groupData.GPassword,
            GLikes: 0,
            GBadgeCount: 0,
            PostCount: 0,
        });
        console.log("here");
        await this.badgeService.scheduleBadgeAfterYear(newGroup.groupId, newGroup.createdDate);
        return newGroup.group;
    }
    async getGroups(queryDto) {
        const { groups, totalCount } = await this.groupRepository.findMany({
            page: queryDto.page,
            pageSize: queryDto.pageSize,
            sortBy: queryDto.sortBy,
            keyword: queryDto.keyword,
            isPublic: queryDto.isPublic
        });
        const totalPages = Math.ceil(totalCount / queryDto.pageSize);
        const groupsWithBadges = await Promise.all(groups.map(async (group) => {
            const badges = await this.badgeRepository.findGroupBadge(group.id);
            return new createGroupDTO_1.GroupInfoResponseDto(group, badges.map(b => b.name));
        }));
        return new createGroupDTO_1.GroupListResponseDto(queryDto.page, totalPages, totalCount, groupsWithBadges);
    }
    async updateGroup(groupId, updateDto, inputPassword) {
        const group = await this.groupRepository.findById(groupId);
        if (!group) {
            throw { status: 404, message: '존재하지 않는 그룹입니다' };
        }
        if (group.password !== inputPassword) {
            throw { status: 403, message: '틀린 비밀번호 입니다.' };
        }
        const updatedData = {};
        if (updateDto.GName)
            updatedData.GName = updateDto.GName;
        if (updateDto.GImage)
            updatedData.GImage = updateDto.GImage;
        if (updateDto.GIntro)
            updatedData.GIntro = updateDto.GIntro;
        if (updateDto.IsPublic !== undefined)
            updatedData.IsPublic = updateDto.IsPublic;
        return this.groupRepository.update(groupId, updatedData);
    }
    async deleteGroup(groupId, password) {
        const group = await this.groupRepository.findById(groupId);
        if (!group) {
            throw { status: 404, message: "존재하지 않는 그룹입니다." };
        }
        if (password !== group.password) {
            throw { status: 403, message: "틀린 비밀번호 입니다." };
        }
        await this.groupRepository.delete(groupId);
    }
    async getGroupInfo(groupId) {
        const group = await this.groupRepository.findById(groupId);
        console.log("getGroupInfo: ", group);
        if (!group) {
            throw { status: 404, message: "존재하지 않는 그룹입니다." };
        }
        const badges = await this.badgeRepository.findGroupBadge(groupId);
        const badgeNames = badges.map(badge => badge.name);
        console.log("BADGES: ", badgeNames);
        return new createGroupDTO_1.GroupInfoResponseDto(group, badgeNames);
    }
    async groupLike(groupId) {
        const group = await this.groupRepository.findById(groupId);
        if (!group) {
            throw { status: 404, message: "존재하지 않는 그룹입니다." };
        }
        const newGroup = await this.groupRepository.update(groupId, { GLikes: { increment: 1 } });
        await this.badgeService.groupLike10000(groupId, newGroup.likeCount);
    }
    async isGroupPublic(groupId) {
        const group = await this.groupRepository.findById(groupId);
        if (!group) {
            throw { status: 404, message: " 존재하지 않는 그룹입니다." };
        }
        return group.isPublic;
    }
    async verifyGroupPassword(groupId, password) {
        const group = await this.groupRepository.findById(groupId);
        if (!group) {
            throw { status: 404, message: " 존재하지 않는 그룹입니다." };
        }
        return password === group.password;
    }
}
exports.GroupService = GroupService;
