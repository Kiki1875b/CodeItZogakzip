"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = void 0;
class Group {
    constructor(id, name, imageUrl, isPublic, password, introduction, likeCount, badgeCount, postCount, createdAt) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.isPublic = isPublic;
        this.password = password;
        this.introduction = introduction;
        this.likeCount = likeCount;
        this.badgeCount = badgeCount;
        this.postCount = postCount;
        this.createdAt = createdAt;
    }
    static fromPrisma(prismaGroup) {
        return new Group(prismaGroup.GID, prismaGroup.GName, prismaGroup.GImage, prismaGroup.IsPublic, prismaGroup.GPassword, prismaGroup.GIntro, prismaGroup.GLikes, prismaGroup.GBadgeCount, prismaGroup.PostCount, prismaGroup.CreatedDate);
    }
}
exports.Group = Group;
