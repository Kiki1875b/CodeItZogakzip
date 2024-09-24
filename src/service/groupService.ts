import { PrismaClient } from ".prisma/client";

const prisma = new PrismaClient();

// id 로 그룹 조회
export const findGroupById = async (groupId : number) => {
  const group = await prisma.group.findUnique({
    where: {GID : groupId},
  });

  return group;
}

export const updateGroupInfo = async (groupId : number, group : any) => {
  
  const updatedGroup = await prisma.group.update({
    where: {GID : groupId},
    data : group,
  })

  return updatedGroup;
}

export const deleteGroupById = async (groupId: number) => {

  console.log("deleting");
  return await prisma.group.delete({
    where: {GID : groupId},
  });
};