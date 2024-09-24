import { PrismaClient } from "@prisma/client";
import { CreateGroupDto } from "../DTO/createGroupDTO";

const prisma = new  PrismaClient();

export async function createGroup(groupData : CreateGroupDto){
  try
  {  
    const newGroup = await prisma.group.create({
      data: {
        GName: groupData.GName,
        GImage: groupData.GImage,
        IsPublic: groupData.IsPublic,
        GIntro: groupData.GIntro,
        GPassword: groupData.GPassword,
        GLikes: 0,
        GBadgeCount: 0,
        PostCount:0,
      }
    });
    return newGroup;
  } catch (error){
    console.log("ERROR");
  }
}