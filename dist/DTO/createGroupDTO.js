"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGroupDto = exports.CreateGroupDto = void 0;
class CreateGroupDto {
    constructor(name, password, isPublic, imageURL, introduction) {
        this.GName = name;
        this.GPassword = password;
        this.IsPublic = isPublic;
        this.GImage = imageURL;
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
