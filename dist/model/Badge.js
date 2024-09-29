"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Badge = void 0;
class Badge {
    constructor(id, name, description, condition) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.condition = condition;
    }
    static fromPrisma(prismaBadge) {
        return new Badge(prismaBadge.BadgeID, prismaBadge.Name, prismaBadge.Description, prismaBadge.Condition);
    }
}
exports.Badge = Badge;
