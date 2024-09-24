"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGroup = createGroup;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function createGroup(groupData) {
    try {
        const newGroup = await prisma.group.create({
            data: {
                GName: groupData.GName,
                GImage: groupData.GImage,
                IsPublic: groupData.IsPublic,
                GIntro: groupData.GIntro,
                GPassword: groupData.GPassword,
                GLikes: 0,
                GBadgeCount: 0,
                PostCount: 0,
            }
        });
        return newGroup;
    }
    catch (error) {
        console.log("ERROR");
    }
}
