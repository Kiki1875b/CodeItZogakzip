import { PrismaClient } from "@prisma/client";
import { Badge } from "../model/Badge";

export class BadgeRepository{
  private prisma: PrismaClient;

  constructor(prisma : PrismaClient){
    this.prisma = prisma;
  }

  async findGroupBadge(groupId: number): Promise<Badge[]>{
    const groupBadges = await this.prisma.groupBadge.findMany({
      where: { GID : groupId},
      include: {badge : true},
    });

    return groupBadges.map(gb => Badge.fromPrisma(gb.badge));
  }

  async createGroubBadge(groupId: number, badgeId: number): Promise<void>{
    await this.prisma.groupBadge.create({
      data : { GID : groupId, BadgeID: badgeId},
    });
  }
}