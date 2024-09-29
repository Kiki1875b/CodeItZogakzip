"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findGroupBadge = void 0;
exports.checkNumOfMemories = checkNumOfMemories;
exports.check7Consecutive = check7Consecutive;
exports.giveBadge = giveBadge;
const client_1 = require(".prisma/client");
const groupService_1 = require("./groupService");
const prisma = new client_1.PrismaClient();
const findGroupBadge = async (groupId) => {
    const badges = await prisma.groupBadge.findMany({
        where: {
            GID: groupId,
        },
        include: {
            badge: true,
        },
    });
    return badges.map((groupBadge) => groupBadge.badge.Name);
};
exports.findGroupBadge = findGroupBadge;
// 20개 이상 post badge
async function checkNumOfMemories(groupId) {
    const group = await (0, groupService_1.findGroupById)(groupId);
    if (!group) {
        throw { status: 404, message: "존재하지 않는 그룹" };
    }
    if (group.PostCount >= 20) {
        const badgeNames = await (0, exports.findGroupBadge)(groupId);
        if (!badgeNames.includes("20개 이상 등록")) {
            await giveBadge(groupId, 2); // 2 는 추후 정말 사용할 badge id를 등록
        }
    }
}
//7일 연속
async function check7Consecutive(groupId) {
    const today = new Date();
    const targetDate = new Date();
    targetDate.setDate(today.getDate() - 6);
    const memories = await prisma.post.findMany({
        where: {
            GID: groupId,
            CreatedDate: {
                gte: targetDate
            }
        },
        orderBy: { CreatedDate: 'desc' }
    });
    if (memories.length < 7) {
        return false;
    }
    for (let i = 0; i < memories.length - 1; i++) {
        const current = new Date(memories[i].CreatedDate);
        const next = new Date(memories[i + 1].CreatedDate);
        const diff = (current.getTime() - next.getTime()) / (1000 * 3600 * 24);
        if (diff > 1) {
            return false;
        }
    }
    await giveBadge(groupId, 1);
}
async function giveBadge(groupId, badgeId) {
    await prisma.groupBadge.create({
        data: {
            GID: groupId,
            BadgeID: badgeId,
        },
    });
}
