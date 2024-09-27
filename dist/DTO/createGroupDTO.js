"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupQueryDto = exports.GroupListResponseDto = exports.GroupInfoResponseDto = exports.UpdateGroupDto = exports.CreateGroupDto = void 0;
class CreateGroupDto {
    constructor(name, password, isPublic, imageURL, introduction) {
        this.GName = name;
        this.GPassword = password;
        this.GImage = imageURL;
        this.IsPublic = isPublic;
        this.GIntro = introduction;
    }
}
exports.CreateGroupDto = CreateGroupDto;
class UpdateGroupDto {
    constructor(gName, isPublic, gPassword, gImage, gIntro) {
        this.GName = gName;
        this.IsPublic = isPublic;
        this.GPassword = gPassword;
        this.GImage = gImage;
        this.GIntro = gIntro;
    }
}
exports.UpdateGroupDto = UpdateGroupDto;
class GroupInfoResponseDto {
    constructor(group, badges) {
        this.id = group.id;
        this.name = group.name;
        this.imageUrl = group.imageUrl;
        this.isPublic = group.isPublic;
        this.likeCount = group.likeCount;
        this.badges = badges;
        this.postCount = group.postCount;
        this.createdAt = group.createdAt;
        this.introduction = group.introduction;
    }
}
exports.GroupInfoResponseDto = GroupInfoResponseDto;
class GroupListResponseDto {
    constructor(currentPage, totalPages, totalItemCount, groupsInfo) {
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.totalItemCount = totalItemCount;
        this.data = groupsInfo;
    }
}
exports.GroupListResponseDto = GroupListResponseDto;
class GroupQueryDto {
    constructor(query) {
        this.page = Number(query.page) || 1;
        this.pageSize = Number(query.pageSize) || 10;
        this.sortBy = query.sortBy || 'latest';
        this.keyword = query.keyword || '';
        this.isPublic = query.isPublic === 'true';
    }
}
exports.GroupQueryDto = GroupQueryDto;
