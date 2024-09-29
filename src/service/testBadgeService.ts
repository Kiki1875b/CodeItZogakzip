import { BadgeRepository } from "../repositories/BadgeRepository";
import { GroupRepository } from "../repositories/GroupRepository";
import { PostRepository } from "../repositories/PostRepository";
import { Badge } from "../model/Badge";

export class BadgeService{
  constructor(private badgeRepository : BadgeRepository, private groupRepository : GroupRepository, private postRepository: PostRepository){}

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
        await this.badgeRepository.createGroupBadge(groupId, 2); 
      }
    }
  }

  // Group 에 alreadyChecked 같은 bool 값 넣어서 부하 줄이기?
  async check7Consecutive(groupId: number): Promise<void> {
    const group = await this.groupRepository.findById(groupId);
    const badges = await this.badgeRepository.findGroupBadge(groupId);
    let consecutiveDays = 1;
    if(!badges.some(badge => badge.name === "7일 연속 추억 등록")){

      const dates: Date[] | null = await this.postRepository.get7UniqueDates(groupId);
      if(dates){
  
        for(let i = 1; i<dates.length; i++){
          const prev = dates[i-1];
          const cur = dates[i];

          
          if((prev.getTime() - cur.getTime() )/(1000 * 3600 * 24) == 1){
            consecutiveDays++;
          }else{
            consecutiveDays = 1;
          }
          if(consecutiveDays >= 7){
            await this.badgeRepository.createGroupBadge(groupId, 1);
          }
        }
      }
    }
  }
}