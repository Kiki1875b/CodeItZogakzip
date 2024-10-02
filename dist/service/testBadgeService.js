"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeService = void 0;
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
    async checkNumOfMemories(groupId) {
        const group = await this.groupRepository.findById(groupId);
        if (!group) {
            throw { status: 404, message: "존재하지 않는 그룹입니다." };
        }
        if (group.postCount >= 20) {
            const badges = await this.badgeRepository.findGroupBadge(groupId);
            if (!badges.some(badge => badge.name === "20개 이상 등록")) {
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
                for (let i = 1; i < dates.length; i++) {
                    const prev = dates[i - 1];
                    const cur = dates[i];
                    if ((prev.getTime() - cur.getTime()) / (1000 * 3600 * 24) == 1) {
                        consecutiveDays++;
                    }
                    else {
                        consecutiveDays = 1;
                    }
                    if (consecutiveDays >= 7) {
                        await this.badgeRepository.findGroupBadge(groupId);
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
            const currentDate = new Date();
            const createdDate = new Date(group.createdAt);
            const diffInYears = (currentDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
            if (diffInYears >= 1) {
                const badges = await this.badgeRepository.findGroupBadge(groupId);
                if (!badges.some(badge => badge.name === "1년")) {
                    await this.badgeRepository.createGroupBadge(groupId, 3);
                }
            }
        }
        catch (error) {
            throw error;
        }
    }
    // 그룹 공감마다 호출
    async groupLike10000(groupId) {
        try {
            const group = await this.groupRepository.findById(groupId);
            if (!group) {
                throw { status: 404, message: "존재하지 않는 그룹입니다." };
            }
            if (group.likeCount >= 10000) {
                const badges = await this.badgeRepository.findGroupBadge(groupId);
                if (!badges.some(badge => badge.name === "그룹 공감 10000")) {
                    await this.badgeRepository.createGroupBadge(groupId, 4);
                }
            }
        }
        catch (error) {
            throw error;
        }
    }
    // post 공감마다 호출
    async postLike10000(groupId, postId) {
        try {
            const post = await this.postRepository.getPostDetail(postId);
            if (!post) {
                throw { status: 404, message: "존재하지 않는 그룹입니다." };
            }
            const likeNumber = post.likeCount;
            if (likeNumber >= 10000) {
                const badges = await this.badgeRepository.findGroupBadge(groupId);
                if (!badges.some(badge => badge.name === "글 공감 10000")) {
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
