import { Group } from "../model/Group";

export class CreateGroupDto { //그룹 생성시 사용되는 Dto 
  GName: string;
  GPassword: string;
  GImage?: string;
  IsPublic: boolean;
  GIntro?: string;

  constructor(name: string, password: string, isPublic: boolean, imageURL?: string, introduction?: string) {
    this.GName = name;
    this.GPassword = password;
    this.GImage = imageURL;
    this.IsPublic = isPublic;
    this.GIntro = introduction;
  }
}


export class UpdateGroupDto {  // 그룹 수정시 
  GName?: string;
  GImage?: string;
  GIntro?: string;
  IsPublic?: boolean;
  GPassword?: string;

  constructor(gName?: string, isPublic?: boolean, gPassword?: string, gImage?: string, gIntro?: string) {
    this.GName = gName;
    this.IsPublic = isPublic;
    this.GPassword = gPassword;
    this.GImage = gImage;
    this.GIntro = gIntro;
  }
}

export class GroupInfoResponseDto{ // 그룹 상세 정보 반환 Dto
  id: number;
  name: string;
  imageUrl: string | null;
  isPublic: boolean;
  likeCount: number;
  badges: string[];
  postCount: number;
  createdAt: Date;
  introduction: string | null;

  constructor(group: Group, badges: string[]) {
    this.id = group.id;
    this.name = group.name;
    this.imageUrl = group.imageUrl;
    this.isPublic = group.isPublic;
    this.likeCount = group.likeCount;
    this.badges = badges;
    this.postCount = group.postCount;
    this.createdAt = group.createdAt;
    this.introduction = group.introduction;
  }

}

export class GroupListResponseDto{ // 그룹 리스트 반환 Dto
  currentPage: number;
  totalPages: number;
  totalItemCount: number;
  data: GroupInfoResponseDto[];

  constructor(currentPage: number, totalPages: number, totalItemCount : number, groupsInfo: GroupInfoResponseDto[]){
    this.currentPage = currentPage;
    this.totalPages = totalPages;
    this.totalItemCount = totalItemCount;
    this.data = groupsInfo;
  }
}

export class GroupQueryDto { // 그룹 정렬 Dto
  page: number;
  pageSize: number;
  sortBy: 'latest' | 'mostPosted' | 'mostLiked' | 'mostBadge';
  keyword: string;
  isPublic: boolean;

  constructor(query: any) {
    this.page = Number(query.page) || 1;
    this.pageSize = Number(query.pageSize) || 10;
    this.sortBy = query.sortBy || 'latest';
    this.keyword = query.keyword || '';
    this.isPublic = query.isPublic === 'true';
  }
}