"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeService = void 0;
class BadgeService {
    constructor(badgeRepository, groupRepository) {
        this.badgeRepository = badgeRepository;
        this.groupRepository = groupRepository;
    }
    async getGroupBadges(groupId) {
        const group = await this.groupRepository.findById(groupId);
        if (!group) {
            throw { status: 404, message: "존재하지 않는 그룹입니다." };
        }
        return this.badgeRepository.findGroupBadge(groupId);
    }
    async checkNumOfMemories(groupId) {
        const group = await this.groupRepository.findById(groupId);
        if (!group) {
            throw { status: 404, message: "존재하지 않는 그룹입니다." };
        }
        if (group.postCount >= 20) {
            const badges = await this.badgeRepository.findGroupBadge(groupId);
            if (!badges.some(badge => badge.name === "20개 이상 등록")) {
                await this.badgeRepository.createGroubBadge(groupId, 2);
            }
        }
    }
    async check7Consecutive(groupId) {
    }
}
exports.BadgeService = BadgeService;
