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
    // Group 에 alreadyChecked 같은 bool 값 넣어서 부하 줄이기 ?
    //test 필요. 
    async check7Consecutive(groupId) {
        const group = await this.groupRepository.findById(groupId);
        const badges = await this.badgeRepository.findGroupBadge(groupId);
        let consecutiveDays = 1;
        if (!badges.some(badge => badge.name === "7일 연속 추억 등록")) {
            console.log("not exists");
            const dates = await this.postRepository.get7UniqueDates(groupId);
            if (dates) {
                console.log(dates);
                for (let i = 1; i < dates.length; i++) {
                    const prev = dates[i - 1];
                    const cur = dates[i];
                    console.log((prev.getTime() - cur.getTime()) / (1000 * 3600 * 24));
                    if ((prev.getTime() - cur.getTime()) / (1000 * 3600 * 24) == 1) {
                        consecutiveDays++;
                    }
                    else {
                        consecutiveDays = 1;
                        console.log("failed");
                    }
                    if (consecutiveDays >= 7) {
                        console.log("success");
                        await this.badgeRepository.createGroupBadge(groupId, 1);
                    }
                }
            }
        }
    }
}
exports.BadgeService = BadgeService;
