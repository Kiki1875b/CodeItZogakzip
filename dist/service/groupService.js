"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGroupById = exports.updateGroupInfo = exports.findGroupById = void 0;
const client_1 = require(".prisma/client");
const prisma = new client_1.PrismaClient();
// id 로 그룹 조회
const findGroupById = async (groupId) => {
    const group = await prisma.group.findUnique({
        where: { GID: groupId },
    });
    return group;
};
exports.findGroupById = findGroupById;
const updateGroupInfo = async (groupId, group) => {
    const updatedGroup = await prisma.group.update({
        where: { GID: groupId },
        data: group,
    });
    return updatedGroup;
};
exports.updateGroupInfo = updateGroupInfo;
const deleteGroupById = async (groupId) => {
    console.log("deleting");
    return await prisma.group.delete({
        where: { GID: groupId },
    });
};
exports.deleteGroupById = deleteGroupById;
