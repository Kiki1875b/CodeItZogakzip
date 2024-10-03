import { PrismaClient } from "@prisma/client";
import { Group } from "../model/Group";


export class GroupRepository{
  private prisma: PrismaClient; 

  constructor(prisma: PrismaClient){
    this.prisma = prisma;
  }


  async findById(id : number): Promise<Group | null>{
    const group = await this.prisma.group.findUnique({
      where : {
        GID: id,
      },
    });

    if(!group){
      return null;
    }
    return Group.fromPrisma(group);
  }


  async create(groupData: any): Promise<{group: Group; groupId: number; createdDate: Date}>{
    try{
    const newGroup = await this.prisma.group.create({data : groupData});

    return {group : Group.fromPrisma(newGroup), groupId: newGroup.GID, createdDate: new Date(newGroup.CreatedDate)};
    }catch(error){
      console.log(error);
      throw {error};
    }
  }

  async update(id : number, groupData : any): Promise<Group>{
    const updatedGroup = await this.prisma.group.update({
      where: {GID : id},
      data : groupData,
    });

    return Group.fromPrisma(updatedGroup);
  }


  async delete(id: number): Promise<void>{
    await this.prisma.group.delete({where :{GID: id}});
  }

  async findMany(params: {page: number, pageSize : number, sortBy : string, keyword : string, isPublic: boolean}): Promise<{groups: Group[]; totalCount: number}>{
    const { page, pageSize, sortBy, keyword, isPublic} = params;
    const offset = (page - 1) * pageSize;
    const where = {
      GName : { contains : keyword },
      IsPublic : isPublic,
    };
    

    const [groups, totalCount] = await Promise.all([
      this.prisma.group.findMany({
        where : where,
        skip: offset,
        take: pageSize,
        orderBy: this.getOrderBy(sortBy),
      }),
      this.prisma.group.count({where}),
    ]);

    return {
      groups : groups.map(Group.fromPrisma),
      totalCount,
    };
  }

  private getOrderBy(sortBy : string): any{
    switch (sortBy) {
      case 'latest':
        return { CreatedDate: 'desc' };
      case 'mostLiked':
        return { GLikes: 'desc' };
      case 'mostBadge':
        return { GBadgeCount: 'desc' };
      case 'postCount':
        return { PostCount: 'desc' };
      default:
        return { CreatedDate: 'desc' };
    }
  }
}