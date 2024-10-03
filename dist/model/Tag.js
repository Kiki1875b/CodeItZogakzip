"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tag = void 0;
class Tag {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    static fromPrisma(prismaTag) {
        return new Tag(prismaTag.TagID, prismaTag.Name);
    }
}
exports.Tag = Tag;
