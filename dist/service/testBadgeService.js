"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeService = void 0;
const node_schedule_1 = require("node-schedule");
class BadgeService {
    constructor(badgeRepository, groupRepository, postRepository) {
        this.badgeRepository = badgeRepository;
        this.groupRepository = groupRepository;
        this.postRepository = postRepository;
    }
    async getGroupBadges(groupId) {
        const group = await this.groupRepository.findById(groupId);
        if (!group) {
            throw { status: 404, message: "존재하지 않는 그룹입니다." };
        }
        return this.badgeRepository.findGroupBadge(groupId);
    }
    async scheduleBadgeAfterYear(groupId, createdAt) {
        const checkDate = new Date(createdAt.getTime() + +365 * 24 * 60 * 60 * 1000);
        (0, node_schedule_1.scheduleJob)(checkDate, async () => {
            await this.yearAfterCreated(groupId);
            console.log(`checked badge for ${groupId}`);
        });
    }
    async checkNumOfMemories(groupId) {
        const group = await this.groupRepository.findById(groupId);
        if (!group) {
            throw { status: 404, message: "존재하지 않는 그룹입니다." };
        }
        if (group.postCount >= 20) {
            const badges = await this.badgeRepository.findGroupBadge(groupId);
            if (!badges.some(badge => badge.name === "20개 이상")) {
                await this.badgeRepository.createGroupBadge(groupId, 2);
            }
        }
    }
    // Group 에 alreadyChecked 같은 bool 값 넣어서 부하 줄이기?
    async check7Consecutive(groupId) {
        const group = await this.groupRepository.findById(groupId);
        const badges = await this.badgeRepository.findGroupBadge(groupId);
        let consecutiveDays = 1;
        if (!badges.some(badge => badge.name === "7일 연속 추억 등록")) {
            const dates = await this.postRepository.get7UniqueDates(groupId);
            if (dates) {
                for (let i = 1; i < dates.length; i++) { // 1
                    const prev = dates[i - 1]; // -1
                    const cur = dates[i];
                    if ((prev.getTime() - cur.getTime()) / (1000 * 3600 * 24) == 1) {
                        consecutiveDays++;
                    }
                    else {
                        consecutiveDays = 1;
                    }
                    if (consecutiveDays >= 1) {
                        const badges = await this.badgeRepository.findGroupBadge(groupId);
                        if (!badges.some(badge => badge.name === "7일연속")) {
                            await this.badgeRepository.createGroupBadge(groupId, 1);
                        }
                    }
                }
            }
        }
    }
    async yearAfterCreated(groupId) {
        try {
            const group = await this.groupRepository.findById(groupId);
            if (!group) {
                throw { status: 404, message: "존재하지 않는 그룹입니다." };
            }
            const badges = await this.badgeRepository.findGroupBadge(groupId);
            if (!badges.some(badge => badge.name === "1년")) {
                await this.badgeRepository.createGroupBadge(groupId, 3);
            }
        }
        catch (error) {
            throw error;
        }
    }
    // 그룹 공감마다 호출
    async groupLike10000(groupId, likeCount) {
        try {
            if (likeCount >= 10000) {
                const badges = await this.badgeRepository.findGroupBadge(groupId);
                if (!badges.some(badge => badge.name === "그룹 좋아요 10000")) {
                    await this.badgeRepository.createGroupBadge(groupId, 4);
                }
            }
        }
        catch (error) {
            throw error;
        }
    }
    // post 공감마다 호출
    async postLike10000(groupId, postId, likeCount) {
        try {
            if (likeCount >= 10000) {
                const badges = await this.badgeRepository.findGroupBadge(groupId);
                if (!badges.some(badge => badge.name === "개시글 좋아요 10000")) {
                    await this.badgeRepository.createGroupBadge(groupId, 5);
                }
            }
        }
        catch (error) {
            throw error;
        }
    }
}
exports.BadgeService = BadgeService;
