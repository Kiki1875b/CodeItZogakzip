"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGroup = deleteGroup;
const groupService_1 = require("../service/groupService");
async function deleteGroup(groupID, password) {
    const group = await (0, groupService_1.findGroupById)(groupID);
    if (!group) {
        throw { status: 404, message: "존재하지 않는 그룹입니다." };
    }
    if (password !== group.GPassword) {
        throw { status: 403, message: "틀린 비밀번호 입니다." };
    }
    console.log("found group");
    (0, groupService_1.deleteGroupById)(groupID);
}
