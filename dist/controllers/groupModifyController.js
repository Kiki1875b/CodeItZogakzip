"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGroup = updateGroup;
const groupService_1 = require("../service/groupService");
async function updateGroup({ groupId, updateDto, inputPassword }) {
    const group = await (0, groupService_1.findGroupById)(groupId);
    if (!group) {
        throw { status: 404, message: '존재하지 않는 그룹입니다' };
    }
    if (group.GPassword !== inputPassword) {
        throw { status: 403, message: '틀린 비밀번호 입니다.' };
    }
    if (updateDto.GName)
        group.GName = updateDto.GName;
    if (updateDto.GImage)
        group.GImage = updateDto.GImage;
    if (updateDto.GIntro)
        group.GIntro = updateDto.GIntro;
    if (updateDto.IsPublic !== undefined)
        group.IsPublic = updateDto.IsPublic;
    const updatedGroup = await (0, groupService_1.updateGroupInfo)(groupId, group);
    return updatedGroup;
}
