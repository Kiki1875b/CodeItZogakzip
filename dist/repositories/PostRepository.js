"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
class PostRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async get7UniqueDates(groupId) {
        const query = await this.prisma.$queryRaw `
    SELECT DISTINCT DATE(MemoryMoment) as date 
    FROM \`Posts\`
    WHERE GID = ${groupId}
    ORDER BY date DESC 
    LIMIT 7;
  `;
        if (!query) {
            return null;
        }
        return query.map((record) => record.date);
    }
}
exports.PostRepository = PostRepository;
