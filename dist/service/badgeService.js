"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findGroupBadge = void 0;
const client_1 = require(".prisma/client");
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
