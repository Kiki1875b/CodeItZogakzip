"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeRepository = void 0;
const Badge_1 = require("../model/Badge");
class BadgeRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findGroupBadge(groupId) {
        const groupBadges = await this.prisma.groupBadge.findMany({
            where: { GID: groupId },
            include: { badge: true },
        });
        return groupBadges.map(gb => Badge_1.Badge.fromPrisma(gb.badge));
    }
    async createGroubBadge(groupId, badgeId) {
        await this.prisma.groupBadge.create({
            data: { GID: groupId, BadgeID: badgeId },
        });
    }
}
exports.BadgeRepository = BadgeRepository;
