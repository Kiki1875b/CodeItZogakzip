import { GroupRepository } from "../repositories/GroupRepository";
import { BadgeRepository } from "../repositories/BadgeRepository";
import { Group } from "../model/Group";
import { CreateGroupDto, UpdateGroupDto, GroupInfoResponseDto, GroupQueryDto, GroupListResponseDto  } from "../DTO/createGroupDTO";
import { deleteGroup } from "../controllers/groupController";

export class GroupService{
  constructor(private groupRepository : GroupRepository, private badgeRepository : BadgeRepository){}

  async createGroup(groupData : CreateGroupDto): Promise<Group>{
    return this.groupRepository.create({
      GName: groupData.GName,
      GImage : groupData.GImage,
      IsPublic : groupData.IsPublic,
      GIntro : groupData.GIntro,
      GPassword : groupData.GPassword,
      GLikes : 0,
      GBadgeCount: 0,
      PostCount : 0,
    });
  }

  async getGroups(queryDto : GroupQueryDto): Promise<GroupListResponseDto> {
    const {groups, totalCount} = await this.groupRepository.findMany({
      page: queryDto.page,
      pageSize : queryDto.pageSize,
      sortBy : queryDto.sortBy,
      keyword : queryDto.keyword,
      isPublic : queryDto.isPublic
    });
    const totalPages = Math.ceil(totalCount / queryDto.pageSize);

    const groupsWithBadges = await Promise.all(groups.map(async (group) =>{
      const badges = await this.badgeRepository.findGroupBadge(group.id);
      return new GroupInfoResponseDto(group, badges.map(b => b.name));
    }));

    return new GroupListResponseDto(queryDto.page, totalPages, totalCount, groupsWithBadges);
  }

  async updateGroup(groupId : number, updateDto : UpdateGroupDto, inputPassword: string): Promise<Group>{
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw { status: 404, message: '존재하지 않는 그룹입니다' };
    }

    if (group.password !== inputPassword) {
      throw { status: 403, message: '틀린 비밀번호 입니다.' };
    }

    const updatedData: any = {};

    if (updateDto.GName) updatedData.GName = updateDto.GName;
    if (updateDto.GImage) updatedData.GImage = updateDto.GImage;
    if (updateDto.GIntro) updatedData.GIntro = updateDto.GIntro;
    if (updateDto.IsPublic !== undefined) updatedData.IsPublic = updateDto.IsPublic;

    return this.groupRepository.update(groupId, updatedData);
  }

  async deleteGroup(groupId: number, password: string): Promise<void>{
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw { status: 404, message: "존재하지 않는 그룹입니다." };
    }
    if (password !== group.password) {
      throw { status: 403, message: "틀린 비밀번호 입니다." };
    }

    await this.groupRepository.delete(groupId);
  }

  async getGroupInfo(groupId: number): Promise<GroupInfoResponseDto>{
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw { status: 404, message: "존재하지 않는 그룹입니다." };
    }

    const badges = await this.badgeRepository.findGroupBadge(groupId);
    const badgeNames = badges.map(badge => badge.name);
    return new GroupInfoResponseDto(group, badgeNames);
  }


  async groupLike(groupId: number): Promise<void> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw { status: 404, message: "존재하지 않는 그룹입니다." };
    }

    await this.groupRepository.update(groupId, { GLikes: { increment: 1 } });
  }

  async isGroupPublic(groupId : number) : Promise<boolean>{
    const group = await this.groupRepository.findById(groupId);
    if(!group){
      throw { status : 404, message : " 존재하지 않는 그룹입니다."};
    }

    return group.isPublic;
  }

  async verifyGroupPassword(groupId : number, password : string): Promise<boolean>{
    const group = await this.groupRepository.findById(groupId);
    if(!group){
      throw { status : 404, message : " 존재하지 않는 그룹입니다."};
    }

    return password === group.password;
  }
}