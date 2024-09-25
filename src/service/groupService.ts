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


export const verifyGroupPassword = async (groupId: number, password : string) =>{
  const group = await findGroupById(groupId);
  if (!group) {
    throw { status: 404, message: "존재하지 않는 그룹입니다." };
  }

  const isPasswordValid = group.GPassword === password;

  if(!isPasswordValid){
    throw {status: 404 , message: "틀린 비밀번호"};
  }

  return true;
}