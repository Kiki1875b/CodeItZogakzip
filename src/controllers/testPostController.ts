import { Request, Response} from 'express';
import prisma from '../prisma';
import { GroupService } from '../service/testGroupService';
import { PostService } from '../service/postService';
import { CreatePostDto, PostQueryDto, PostUpdateDto } from '../DTO/postDTO';

export class PostController{
  constructor(private groupService: GroupService, private postService: PostService){}

  async createPost(req: Request, res: Response){
    try{
      const groupId  = parseInt(req.params.GID, 10);

      const {
        nickname,
        title,
        content,
        isPublic,
        postPassword,
        gPassword,
        imageUrl,
        tags,
        location,
        moment,
      } = req.body;
      

      const momentDate = new Date(moment);


      const postDto = new CreatePostDto(
        nickname,
        title,
        content,
        postPassword,
        tags,
        location,
        momentDate,
        isPublic,
        imageUrl
      );


      const newPost = await this.postService.createPost(groupId, postDto);
      if(!newPost) throw {error : 404, message : "invalid"};
      res.status(200).json({
        id: newPost.postId,
        groupId : groupId,
        nickname: newPost.nickname,
        title: newPost.title,
        content: newPost.content,
        imageUrl: newPost.imageUrl,
        tags: newPost.tags,
        location : newPost.location,
        moment: newPost.memoryMoment,
        isPublic: newPost.isPublic,
        likeCount: newPost.likeCount,
        commentCount: newPost.commentCount,
        createdAt: newPost.createdAt
      });
    }catch(error){
      console.log(error);
      res.status(400).json({message : "잘못된 요청입니다."});
    }
  }

  async getPosts(req: Request, res: Response){
    const groupId = parseInt(req.params.GID,10);
    try{
      const queryDto = new PostQueryDto(req.query);
      
      const postListResponse = await this.postService.getPosts(queryDto, groupId);
      res.status(200).json(postListResponse);
    }catch{
      res.status(400).json({message: "잘못된 요청입니다"});
    }
  }

  async updatePost(req: Request, res: Response){
    const postId = parseInt(req.params.postId, 10);
    const {nickname, title, content, postPassword, imageUrl, tags, location, moment, isPublic} = req.body;
    try{
      const updateDto = new PostUpdateDto(nickname, title, content, tags, location, moment, isPublic, imageUrl);
      const updatedPost = await this.postService.updatePost(updateDto, postId , postPassword);

      res.status(200).json(updatedPost);
    }catch(error){
      res.status(404).json(error);
    }
  }


  async deletePost(req: Request, res: Response){
    try{
      const postId = parseInt(req.params.postId, 10);
      const { postPassword } = req.body;
      await this.postService.deletePost(postId, postPassword);
      res.status(200).json({message: "성공적으로 삭제"})
    }catch(error){
      res.status(404).json(error);
    }
  }


  async postDetail(req:Request, res:Response){
    try{
      const postId = parseInt(req.params.postId, 10);
      const post = await this.postService.getPostDetail(postId);
      res.status(200).json(post);
    }catch(error){
      res.status(404).json(error);
    }
  }

  async verifyPassword(req: Request, res: Response){
    try{
      const postId = parseInt(req.params.postId, 10);
      const { password } = req.body;



      const verification = await this.postService.verifyPassword(postId, password);
      if(!verification){
        throw {status: 404, message :"verification failed"}
      }
      res.status(200).json(verification);
    }catch(error){
      res.status(404).json({error});
    }
  }

  async postLike(req: Request, res: Response){
    try{
      const postId = parseInt(req.params.postId, 10);
      await this.postService.postLike(postId);
      res.status(200).json({message: "게시글 공감하기 성공"});
    }catch{
      res.status(404).json({message: "존재하지 않습니다."});
    }
  }

  async isPublic(req:Request, res:Response){
    try{
      
      const postId = parseInt(req.params.postId, 10);
      const isPublic  = await this.postService.isPublic(postId);
      res.status(200).json(isPublic);

    }catch(error){
      res.status(404).json(error);
    }
  }
}