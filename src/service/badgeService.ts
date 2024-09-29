import { PrismaClient } from ".prisma/client";
import { findGroupById } from "./groupService";

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

// 20개 이상 post badge
export async function checkNumOfMemories(groupId: number){
  const group = await findGroupById(groupId);

  if(!group){
    throw {status: 404, message : "존재하지 않는 그룹"}
  }

  if(group.PostCount >= 20){
    const badgeNames = await findGroupBadge(groupId);
    if(!badgeNames.includes("20개 이상 등록")) {
      await giveBadge(groupId, 2); // 2 는 추후 정말 사용할 badge id를 등록
    }
  }
}

//7일 연속
export async function check7Consecutive(groupId: number){
  const today = new Date();
  const targetDate = new Date();
  targetDate.setDate(today.getDate() - 6);

  const memories = await prisma.post.findMany({
    where : {
      GID : groupId,
      CreatedDate:{
        gte: targetDate
      }
    },
    orderBy: { CreatedDate : 'desc'}
  });


  if(memories.length < 7){
    return false;
  }

  for(let i = 0; i<memories.length-1; i++){
    const current = new Date(memories[i].CreatedDate);
    const next = new Date(memories[i + 1].CreatedDate);
    const diff = (current.getTime() - next.getTime()) / (1000 * 3600 * 24);

    if(diff > 1){
      return false;
    }
  }

  await giveBadge(groupId, 1);
}

export async function giveBadge(groupId : number, badgeId : number){
  await prisma.groupBadge.create({
    data: {
      GID : groupId,
      BadgeID : badgeId,
    },
  });
}