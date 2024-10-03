import { BadgeRepository } from "../repositories/BadgeRepository";
import { GroupRepository } from "../repositories/GroupRepository";
import { PostRepository } from "../repositories/PostRepository";
import {scheduleJob} from 'node-schedule'

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

  async scheduleBadgeAfterYear(groupId: number, createdAt: Date){
    const checkDate = new Date(createdAt.getTime() + + 365 * 24 * 60 * 60 * 1000);

    scheduleJob(checkDate, async () => {
      await this.yearAfterCreated(groupId);
      console.log(`checked badge for ${groupId}`);
    })
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
  
        for(let i = 1; i<dates.length; i++){ // 1
          const prev = dates[i-1]; // -1
          const cur = dates[i];

          
          if((prev.getTime() - cur.getTime() )/(1000 * 3600 * 24) == 1){
            consecutiveDays++;
          }else{
            consecutiveDays = 1;
          }
          if(consecutiveDays >= 1){
            const badges = await this.badgeRepository.findGroupBadge(groupId);
            if(!badges.some(badge => badge.name === "7일연속")){
              await this.badgeRepository.createGroupBadge(groupId, 1);
            }
          }
        }
      }
    }
  }


  async   yearAfterCreated(groupId: number): Promise<void>{
    try{
      const group = await this.groupRepository.findById(groupId);

      if(!group){
        throw { status: 404, message: "존재하지 않는 그룹입니다." }
      }


      const badges= await this.badgeRepository.findGroupBadge(groupId);
      if(!badges.some(badge => badge.name === "1년")){
        await this.badgeRepository.createGroupBadge(groupId, 3);
      }
      
    }catch(error){
      throw error;
    }
  }

  // 그룹 공감마다 호출
  async groupLike10000(groupId: number , likeCount: number){
    try{

      if(likeCount >= 10000){
        const badges = await this.badgeRepository.findGroupBadge(groupId);
        if(!badges.some(badge=>badge.name === "그룹 좋아요 10000")){
          await this.badgeRepository.createGroupBadge(groupId, 4);
        }
      }
    }catch(error){
      throw error;
    }
  }

  // post 공감마다 호출
  async postLike10000(groupId: number, postId: number, likeCount: number){
    try{

      if(likeCount >= 10000){
        const badges = await this.badgeRepository.findGroupBadge(groupId);
        if(!badges.some(badge => badge.name === "개시글 좋아요 10000")){
          await this.badgeRepository.createGroupBadge(groupId, 5);
        }
      }

    }catch(error){
      throw error;
    }
  }
}