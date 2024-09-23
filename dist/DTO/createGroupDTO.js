"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGroupDto = void 0;
class CreateGroupDto {
    constructor(gName, isPublic, gPassword, gImage, gIntro) {
        this.GName = gName;
        this.IsPublic = isPublic;
        this.GPassword = gPassword;
        this.GImage = gImage;
        this.GIntro = gIntro;
    }
}
exports.CreateGroupDto = CreateGroupDto;
