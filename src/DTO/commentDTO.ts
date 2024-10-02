
export class ReturnCreateCommentDto{
  id: number;
  nickname: string;
  content: string;
  createdAt: Date;

  constructor(id: number, nickname: string, content: string, createdAt: Date){
    this.id = id;
    this.nickname = nickname;
    this.content = content;
    this.createdAt = createdAt;
  }
}

export class SendCreateCommentDto{
  postId: number;
  nickname: string;
  content: string;
  password: string;
  constructor(id: number, nickname: string, content: string, password: string){
    this.postId = id;
    this.nickname = nickname;
    this.content = content;
    this.password = password;
  }
}

export class CommentUpdateDto{
  commentId: number;
  nickname: string;
  content: string;
  password: string;

  constructor(id: number, nickname: string, content: string, password: string){
    this.commentId = id;
    this.nickname = nickname;
    this.content = content;
    this.password = password;
  }
}


export class CommentListDto{
  currentPage: number;
  totalPages : number;
  totalItemCount: number;
  data : ReturnCreateCommentDto[];

  constructor(currentPage: number, totalPages: number, totalItemCount: number, data: ReturnCreateCommentDto[]){
    this.currentPage = currentPage;
    this.totalPages = totalPages;
    this.totalItemCount = totalItemCount;
    this.data = data;
  }
}

