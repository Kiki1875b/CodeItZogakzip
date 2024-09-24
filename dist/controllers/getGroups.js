"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroups = getGroups;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function getGroups({ page, pageSize, sortBy, keyword, isPublic }) {
    console.log(page, pageSize, sortBy, keyword, isPublic);
    const offset = (page - 1) * pageSize;
    const condition = {
        GName: { contains: keyword },
        IsPublic: isPublic,
    };
    let orderBy = {};
    switch (sortBy) {
        case 'latest':
            orderBy = { CreatedDate: 'desc' };
            break;
        case 'mostLiked':
            orderBy = { GLikes: 'desc' };
            break;
        case 'mostBadge':
            orderBy = { GBadgeCount: 'desc' };
            break;
        case 'postCount':
            orderBy = { PostCount: 'desc' };
            break;
        default:
            orderBy = { CreatedDate: 'desc' };
    }
    const totalItemCount = await prisma.group.count({ where: condition, });
    const groups = await prisma.group.findMany({
        where: condition,
        skip: offset,
        take: pageSize,
        orderBy: orderBy,
        select: {
            GID: true,
            GName: true,
            GImage: true,
            GIntro: true,
            IsPublic: true,
            GLikes: true,
            GBadgeCount: true,
            CreatedDate: true,
            PostCount: true,
        },
    });
    const totalPages = Math.ceil(totalItemCount / pageSize);
    const formattedGroups = groups.map(group => ({
        id: group.GID,
        name: group.GName,
        imageUrl: group.GImage,
        isPublic: group.IsPublic,
        likeCount: group.GLikes,
        badgeCount: group.GBadgeCount,
        postCount: group.PostCount,
        createdAt: group.CreatedDate,
        introduction: group.GIntro,
    }));
    return {
        currentPage: page,
        totalPages: totalPages,
        totalItemCount: totalItemCount,
        data: formattedGroups,
    };
}
