import { PrismaClient } from "@prisma/client";
import { CreateGroupDto, UpdateGroupDto } from "../DTO/createGroupDTO";
import { findGroupById, updateGroupInfo, deleteGroupById } from "../service/groupService";
import { findGroupBadge } from "../service/badgeService";

interface getGroupParams{
  page : number;
  pageSize : number;
  sortBy : string;
  keyword : string;
  isPublic : boolean;
}

interface ModifyGroupParams{
  groupId : number;
  updateDto : UpdateGroupDto;
  inputPassword : string;
}


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

export async function getGroup({page, pageSize, sortBy, keyword, isPublic} : getGroupParams){
  console.log( page, pageSize, sortBy, keyword, isPublic);
  const offset = (page - 1) * pageSize;
  const condition = {
    GName: {contains : keyword},
    IsPublic : isPublic,
  };

  let orderBy = {};

  switch(sortBy){
    case 'latest':
      orderBy = {CreatedDate : 'desc'};
      break;
    case 'mostLiked':
      orderBy = {GLikes : 'desc'};
      break;
    case 'mostBadge':
      orderBy = {GBadgeCount: 'desc'};
      break;
    case 'postCount':
      orderBy = {PostCount: 'desc'};
      break;
    default:
      orderBy = {CreatedDate : 'desc'};
    
  }

  const totalItemCount = await prisma.group.count({ where : condition, });

  const groups = await prisma.group.findMany({
    where: condition,
    skip: offset,
    take: pageSize,
    orderBy: orderBy,
    select: {
      GID: true,
      GName: true,
      GImage: true,
      GIntro: true,
      IsPublic: true,
      GLikes: true,
      GBadgeCount: true,
      CreatedDate: true,
      PostCount : true,
    },
  });

  const totalPages = Math.ceil(totalItemCount / pageSize);

  const formattedGroups = groups.map(group => ({
    id : group.GID,
    name : group.GName,
    imageUrl : group.GImage,
    isPublic : group.IsPublic,
    likeCount : group.GLikes,
    badgeCount : group.GBadgeCount,
    postCount : group.PostCount,
    createdAt : group.CreatedDate,
    introduction : group.GIntro,
  }));

  
  return{
    currentPage : page,
    totalPages : totalPages,
    totalItemCount : totalItemCount,
    data : formattedGroups,
  };
}

export async function updateGroup({groupId, updateDto, inputPassword} : ModifyGroupParams){

  const group = await findGroupById(groupId);

  if(!group){
    throw { status: 404, message: '존재하지 않는 그룹입니다'};
  }

  if(group.GPassword !== inputPassword){
    throw {status: 403, message : '틀린 비밀번호 입니다.'};
  }

  if(updateDto.GName) group.GName = updateDto.GName;
  if(updateDto.GImage) group.GImage = updateDto.GImage;
  if(updateDto.GIntro) group.GIntro = updateDto.GIntro;
  if(updateDto.IsPublic !== undefined) group.IsPublic = updateDto.IsPublic;

  const updatedGroup = await updateGroupInfo(groupId, group);

  return updatedGroup;
}

export async function deleteGroup(groupID: number, password : string){
  const group = await findGroupById(groupID);

  if(!group){
    throw { status : 404 , message : "존재하지 않는 그룹입니다."};
  }
  if(password !== group.GPassword){
    throw {status : 403, message : "틀린 비밀번호 입니다."};
  }
  

  deleteGroupById(groupID);
}

export async function getGroupInfo(groupID: number){
  const group = await findGroupById(groupID);

  if(!group){
    throw { status : 404 , message : "존재하지 않는 그룹입니다."};
  }

  const badges = await findGroupBadge(groupID);

  return({
    id: group.GID,
    name : group.GName,
    imageUrl : group.GImage,
    isPublic : group.IsPublic,
    likeCount : group.GLikes,
    badges : badges,
    postCount : group.PostCount,
    createdAt : group.CreatedDate,
    introduction : group.GIntro
  });

}

export async function groupLike(groupID: number){
  const group = await findGroupById(groupID);
  
  if(!group){
    throw {status: 404, message : "존재하지 않는 그룹입니다."};
  }

  await prisma.group.update({
    where: { GID: groupID },
    data: {
      GLikes:{
        increment: 1,
      },
    },
  });
  
  return { message : "그룹 공감하기 성공" };
}