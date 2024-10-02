import { Request, Response } from 'express';
import { GroupService } from '../service/testGroupService';
import {BadgeService} from'../service/testBadgeService';
import { CreateGroupDto, GroupQueryDto, UpdateGroupDto } from '../DTO/createGroupDTO';


export class GroupController{
  constructor(private groupService : GroupService, private badgeService: BadgeService){}

  async createGroup(req : Request, res : Response){
    const {name, password,  isPublic, introduction } = req.body;
    const imageFile = req.file;

    try{ 
      
      const imageUrl = imageFile ? `/uploads/groups/main/${imageFile.filename}` : undefined;
      const createGroupDto = new CreateGroupDto(name, password, isPublic, imageUrl, introduction);
      const newGroup = await this.groupService.createGroup(createGroupDto);
      res.status(200).json(newGroup);
    }catch(error){
      res.status(400).json({message : "그룹 생성 오류"});
    }
  }

  async getGroups(req: Request, res: Response) {
    try {
      const queryDto = new GroupQueryDto(req.query);

      const groupListResponse = await this.groupService.getGroups(queryDto);
      res.status(200).json(groupListResponse);
    }catch (error){
      res.status(500).json({message : "그룹 목록 실패"});
    }
  }

  async updateGroup(req: Request, res: Response) {
    const groupId = parseInt(req.params.GID, 10);
    const { name, password, imageUrl, isPublic, introduction } = req.body;

    try {
      const updateGroupDto = new UpdateGroupDto(name, isPublic, password, imageUrl, introduction);
      const updatedGroup = await this.groupService.updateGroup(groupId, updateGroupDto, password);

      res.status(200).json(updatedGroup);
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  async deleteGroup(req: Request, res: Response) {
    const groupId = parseInt(req.params.GID, 10);
    const { password } = req.body;

    try {
      await this.groupService.deleteGroup(groupId, password);
      res.status(200).json({ message: "성공적으로 삭제되었습니다." });
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  async getGroupInfo(req: Request, res: Response) {
    const groupId = parseInt(req.params.GID, 10);
    try {
      const groupInfo = await this.groupService.getGroupInfo(groupId);
      if (!groupInfo.isPublic) {
        return res.status(302).json({ message: '비공개 그룹입니다. 비밀번호를 입력해 주세요.' });
      }
      res.status(200).json({ groupInfo });
    } catch (error: any) {
      res.status(error.status || 404).json({ message: error.message });
    }
  }

  async groupLike(req: Request, res: Response) {
    const groupId = parseInt(req.params.GID, 10);
    try {
      await this.groupService.groupLike(groupId);
      return res.status(200).json({ message: "그룹 공감하기 성공" });
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  async isGroupPublic(req: Request, res: Response) {
    const groupId = parseInt(req.params.GID, 10);
    try{
      const isPublic = this.groupService.isGroupPublic(groupId);
      res.status(200).json({id : groupId, isPublic});
    }catch(error : any){
      res.status(error.status  || 404).json({message : error.message});
    }
  }

  async verifyGroupPassword(req: Request, res: Response) {
    const groupId = parseInt(req.params.GID, 10);
    const { password } = req.body;
    try {
      const isValid = await this.groupService.verifyGroupPassword(groupId, password);
      if (isValid) {
        res.status(200).json({ message: "비밀번호가 확인되었습니다." });
      } else {
        res.status(401).json({ message: "틀린 비밀번호입니다." });
      }
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message });
    }
  }
}