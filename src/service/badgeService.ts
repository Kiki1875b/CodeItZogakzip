import { PrismaClient } from ".prisma/client";

const prisma = new PrismaClient();


export const findGroupBadge = async (groupId : number): Promise<string[]> => {
  const badges = await prisma.groupBadge.findMany({
    where: {
      GID: groupId,
    },
    include:{
      badge: true,
    },
  });
  return badges.map((groupBadge) => groupBadge.badge.Name);
}