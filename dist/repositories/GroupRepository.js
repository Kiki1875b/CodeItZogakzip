"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupRepository = void 0;
const Group_1 = require("../model/Group");
class GroupRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const group = await this.prisma.group.findUnique({
            where: {
                GID: id,
            },
        });
        if (!group) {
            return null;
        }
        return Group_1.Group.fromPrisma(group);
    }
    async create(groupData) {
        try {
            const newGroup = await this.prisma.group.create({ data: groupData });
            return { group: Group_1.Group.fromPrisma(newGroup), groupId: newGroup.GID, createdDate: new Date(newGroup.CreatedDate) };
        }
        catch (error) {
            console.log(error);
            throw { error };
        }
    }
    async update(id, groupData) {
        const updatedGroup = await this.prisma.group.update({
            where: { GID: id },
            data: groupData,
        });
        console.log(updatedGroup.PostCount);
        return Group_1.Group.fromPrisma(updatedGroup);
    }
    async delete(id) {
        console.log('delete');
        try {
            await this.prisma.comment.deleteMany({
                where: {
                    post: {
                        GID: id,
                    },
                },
            });
            await this.prisma.postTag.deleteMany({
                where: {
                    post: {
                        GID: id,
                    },
                },
            });
            await this.prisma.post.deleteMany({
                where: {
                    GID: id,
                },
            });
            await this.prisma.group.delete({
                where: {
                    GID: id,
                },
            });
        }
        catch (error) {
            console.log(error);
        }
    }
    async findMany(params) {
        const { page, pageSize, sortBy, keyword, isPublic } = params;
        const offset = (page - 1) * pageSize;
        const where = {
            GName: { contains: keyword },
            IsPublic: isPublic,
        };
        const [groups, totalCount] = await Promise.all([
            this.prisma.group.findMany({
                where: where,
                skip: offset,
                take: pageSize,
                orderBy: this.getOrderBy(sortBy),
            }),
            this.prisma.group.count({ where }),
        ]);
        return {
            groups: groups.map(Group_1.Group.fromPrisma),
            totalCount,
        };
    }
    getOrderBy(sortBy) {
        switch (sortBy) {
            case 'latest':
                return { CreatedDate: 'desc' };
            case 'mostLiked':
                return { GLikes: 'desc' };
            case 'mostBadge':
                return { GBadgeCount: 'desc' };
            case 'postCount':
                return { PostCount: 'desc' };
            default:
                return { CreatedDate: 'desc' };
        }
    }
}
exports.GroupRepository = GroupRepository;
