import { BadgeRepository } from "../repositories/BadgeRepository";
import { GroupRepository } from "../repositories/GroupRepository";
import { Badge } from "../model/Badge";

export class BadgeService{
  constructor(private badgeRepository : BadgeRepository, private groupRepository : GroupRepository){}

  async getGroupBadges(groupId: number): Promise<Badge[]> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw { status: 404, message: "존재하지 않는 그룹입니다." };
    }

    return this.badgeRepository.findGroupBadge(groupId);

  }

  async checkNumOfMemories(groupId : number): Promise<void>{
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw { status: 404, message: "존재하지 않는 그룹입니다." };
    }
    if(group.postCount >= 20){
      const badges = await this.badgeRepository.findGroupBadge(groupId);
      if(!badges.some(badge => badge.name === "20개 이상 등록")){
        await this.badgeRepository.createGroubBadge(groupId, 2); 
      }
    }
  }

  async check7Consecutive(groupId: number): Promise<void> {
    
  }
}