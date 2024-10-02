"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
const Post_1 = require("../model/Post");
const postDTO_1 = require("../DTO/postDTO");
const Tag_1 = require("../model/Tag");
class PostRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(groupId, postData) {
        try {
            const result = await this.prisma.$transaction(async (prisma) => {
                // tag 관련 작업
                const tagPromises = postData.tags.map(async (tagName) => {
                    let tag = await prisma.tag.findUnique({ where: { Name: tagName } });
                    if (!tag) {
                        tag = await prisma.tag.create({ data: { Name: tagName } });
                    }
                    return tag;
                });
                const tags = await Promise.all(tagPromises);
                // post 관련 작업
                const newPost = await prisma.post.create({
                    data: {
                        Nickname: postData.nickname,
                        Title: postData.title,
                        Content: postData.content,
                        PPassword: postData.postPassword,
                        IsPublic: postData.isPublic,
                        Image: postData.imageUrl,
                        Location: postData.location,
                        MemoryMoment: postData.moment,
                        GID: groupId,
                        postTags: {
                            create: tags.map((tag) => ({
                                tag: {
                                    connect: { TagID: tag.TagID },
                                },
                            })),
                        },
                    },
                    include: {
                        postTags: {
                            include: {
                                tag: true,
                            }
                        }
                    },
                });
                return newPost;
            });
            return Post_1.Post.fromPrisma(result);
        }
        catch (error) {
            throw { status: 404, message: "Error creating Post" };
        }
    }
    async findMany(params) {
        try {
            const { groupId, page, pageSize, sortBy, keyword, isPublic } = params;
            const offset = (page - 1) * pageSize;
            const where = {
                GID: groupId,
                Title: { contains: keyword },
                IsPublic: isPublic,
            };
            const [posts, totalCount] = await Promise.all([
                this.prisma.post.findMany({
                    where: where,
                    skip: offset,
                    take: pageSize,
                    orderBy: this.getOrderBy(sortBy)
                }),
                this.prisma.post.count({ where }),
            ]);
            return {
                posts: posts.map(Post_1.Post.fromPrisma),
                totalCount,
            };
        }
        catch (error) {
            console.log(error);
            throw { status: 403 };
        }
    }
    async findPostTags(postId) {
        const postBadges = await this.prisma.postTag.findMany({
            where: { PostID: postId },
            include: { tag: true },
        });
        return postBadges.map(pb => Tag_1.Tag.fromPrisma(pb.tag));
    }
    async findPostById(postId) {
        const post = await this.prisma.post.findUnique({
            where: { PostID: postId }
        });
        if (!post)
            return null;
        return Post_1.Post.fromPrisma(post);
    }
    async updateLike(id) {
        try {
            await this.prisma.post.update({
                where: { PostID: id },
                data: { LikeCount: { increment: 1 } }
            });
        }
        catch (error) {
            throw { status: 404, message: "error while increasing" };
        }
    }
    async update(id, postData) {
        try {
            await this.prisma.postTag.deleteMany({
                where: { PostID: id }
            });
            console.log(postData);
            const result = await this.prisma.$transaction(async (prisma) => {
                const tagPromises = postData.tags.map(async (tagName) => {
                    let tag = await prisma.tag.findUnique({ where: { Name: tagName } });
                    if (!tag) {
                        tag = await prisma.tag.create({ data: { Name: tagName } });
                    }
                    return tag;
                });
                const tags = await Promise.all(tagPromises);
                const updatedPost = await prisma.post.update({
                    where: { PostID: id },
                    data: {
                        Nickname: postData.Nickname,
                        Title: postData.Title,
                        Content: postData.Content,
                        PPassword: postData.PPassword,
                        Image: postData.Image,
                        Location: postData.Location,
                        MemoryMoment: new Date(postData.MemoryMoment),
                        IsPublic: postData.IsPublic,
                        postTags: {
                            create: tags.map((tag) => ({
                                tag: {
                                    connect: { TagID: tag.TagID },
                                },
                            })),
                        },
                    },
                    include: {
                        postTags: {
                            include: {
                                tag: true,
                            }
                        }
                    },
                });
                return updatedPost;
            });
            return Post_1.Post.fromPrisma(result);
        }
        catch (error) {
            console.log(error);
            throw { error };
        }
    }
    async get7UniqueDates(groupId) {
        const query = await this.prisma.$queryRaw `
    SELECT DISTINCT DATE(CreatedDate) as date 
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
    async getPostDetail(postId) {
        try {
            const post = await this.prisma.post.findUnique({
                where: { PostID: postId }
            });
            if (!post)
                return null;
            return Post_1.Post.fromPrisma(post);
        }
        catch (error) {
            throw error;
        }
    }
    async delete(postId) {
        await this.prisma.postTag.deleteMany({ where: { PostID: postId } });
        await this.prisma.post.delete({ where: { PostID: postId } });
    }
    async checkPublic(postId) {
        const post = await this.prisma.post.findUnique({
            where: { PostID: postId },
            select: {
                PostID: true,
                IsPublic: true,
            }
        });
        if (!post) {
            throw new Error("Post not found");
        }
        return new postDTO_1.PostPublicDto(post.PostID, post.IsPublic);
    }
    getOrderBy(sortBy) {
        switch (sortBy) {
            case 'latest':
                return { CreatedDate: 'desc' };
            case 'mostCommented':
                return { CommentCount: 'desc' };
            case 'mostLiked':
                return { LikeCount: 'desc' };
            default:
                return { CreatedDate: 'desc' };
        }
    }
}
exports.PostRepository = PostRepository;
