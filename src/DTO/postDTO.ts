import {Post} from '../model/Post'

export class CreatePostDto{
  nickname: string;
  title: string;
  content: string;
  postPassword: string;
  imageUrl?: string;
  tags: string[];
  location: string;
  moment: Date;
  isPublic: boolean;

  constructor(nickname: string, title: string, content: string, postPassword: string, tags: string[], location: string, moment: Date, isPublic: boolean, imageUrl?: string){
    this.nickname = nickname;
    this.title = title;
    this.content = content;
    this.postPassword = postPassword;
    this.imageUrl = imageUrl;
    this.tags = tags;
    this.location = location;
    this.moment = moment;
    this.isPublic = isPublic;
  }

}

export class PostQueryDto{
  page: number;
  pageSize: number;
  sortBy: 'latest' | 'mostCommented' | 'mostLiked';
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

export class PostInfoResponseDto {
  id: number;
  nickname: string;
  title: string;
  imageUrl: string|null;
  tags: string[];
  location: string;
  moment: Date;
  isPublic: boolean;
  likeCount: number;
  commentCount: number;
  createdAt: Date;

  constructor(post: Post, tags: string[]) {
    this.id = post.postId;
    this.nickname = post.nickname;
    this.title = post.title;
    this.imageUrl = post.imageUrl;
    this.tags = tags;
    this.location = post.location;
    this.moment = new Date(post.memoryMoment);
    this.isPublic = post.isPublic;
    this.likeCount = post.likeCount;
    this.commentCount = post.commentCount;
    this.createdAt = new Date(post.createdAt);
  }
}



export class PostListResponseDto{
  currentPage: number;
  totalPages: number;
  totalItemCount: number;
  data: PostInfoResponseDto[];

  constructor(currentPage: number, totalPages: number, totalItemCount: number, data: PostInfoResponseDto[]){
    this.currentPage = currentPage;
    this.totalPages = totalPages;
    this.totalItemCount = totalItemCount;
    this.data = data;
  }

}

export class PostPublicDto{
  id: number;
  isPublic: boolean;

  constructor(id: number, isPublic: boolean){
    this.id = id;
    this.isPublic = isPublic;
  }
}

export class PostUpdateDto {
  nickname: string;
  title: string;
  content: string;
  imageUrl?: string;
  tags: string[];
  location: string;
  moment: Date;
  isPublic: boolean;

  constructor(
    nickname: string,
    title: string,
    content: string,
    tags: string[],
    location: string,
    moment: Date,
    isPublic: boolean,
    imageUrl?: string
  ) {
    this.nickname = nickname;
    this.title = title;
    this.content = content;
    this.tags = tags;
    this.location = location;
    this.moment = moment;
    this.isPublic = isPublic;
    this.imageUrl = imageUrl; 
  }
}
