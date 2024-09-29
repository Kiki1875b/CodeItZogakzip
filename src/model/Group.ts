import { PrismaClient } from "@prisma/client";

export class Group {
  constructor(
    public id: number,
    public name: string,
    public imageUrl: string | null,
    public isPublic: boolean,
    public password: string,
    public introduction: string | null,
    public likeCount: number,
    public badgeCount: number,
    public postCount: number,
    public createdAt: Date
  ) {}

  static fromPrisma(prismaGroup: any): Group {
    return new Group(
      prismaGroup.GID,
      prismaGroup.GName,
      prismaGroup.GImage,
      prismaGroup.IsPublic,
      prismaGroup.GPassword,
      prismaGroup.GIntro,
      prismaGroup.GLikes,
      prismaGroup.GBadgeCount,
      prismaGroup.PostCount,
      prismaGroup.CreatedDate
    );
  }
}