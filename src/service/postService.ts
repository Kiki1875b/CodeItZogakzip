import { CreatePostDto, PostInfoResponseDto, PostListResponseDto, PostPublicDto, PostQueryDto, PostUpdateDto } from '../DTO/postDTO'
import {Post} from '../model/Post'
import { PostRepository } from '../repositories/PostRepository'
import { GroupRepository } from '../repositories/GroupRepository';
import { BadgeService } from './testBadgeService';

export class PostService{
  constructor(private postRepository: PostRepository, private badgeService: BadgeService, private groupRepository: GroupRepository ){}

  async createPost(groupId: number, post: CreatePostDto): Promise<Post | undefined>{
    
    const newPost = await this.postRepository.create(groupId, post);
    await this.badgeService.check7Consecutive(groupId);
    await this.badgeService.checkNumOfMemories(groupId);


    return newPost;
  }

  async getPosts(queryDto : PostQueryDto, groupId: number): Promise<PostListResponseDto>{
    const {posts, totalCount} = await this.postRepository.findMany({
      groupId : groupId,
      page: queryDto.page,
      pageSize : queryDto.pageSize,
      sortBy : queryDto.sortBy,
      keyword : queryDto.keyword,
      isPublic: queryDto.isPublic
    });

   

    const totalPages = totalCount / queryDto.pageSize;

    const postWithTags = await Promise.all(posts.map(async (post) =>{
      const tags = await this.postRepository.findPostTags(post.postId);
      return new PostInfoResponseDto(post, tags.map(t => t.name));
    }));

    return new PostListResponseDto(queryDto.page, totalPages, totalCount, postWithTags);
  }

  async updatePost(updateDto: PostUpdateDto, postId: number, postPassword: string): Promise<Post>{
    try {
    const post = await this.postRepository.findPostById(postId);
    if(!post){
      throw {status: 404, message: "존재하지 않는 개시글"}
    }

    if (post.postPassword !== postPassword) {
      throw {status: 403, message: "틀린 비밀번호"}
    }
    

    const updatedData: any = {};

    if(updateDto.nickname) updatedData.Nickname = updateDto.nickname;


    if(updateDto.title) updatedData.Title = updateDto.title;


    if(updateDto.content) updatedData.content = updateDto.content;

    if(updateDto.imageUrl) updatedData.Image = updateDto.imageUrl;
    if(updateDto.tags) updatedData.tags = updateDto.tags;
    if(updateDto.location) updatedData.Location = updateDto.location;
    if(updateDto.moment) updatedData.MemoryMoment = updateDto.moment;
    if(updateDto.isPublic !== undefined) updatedData.IsPublic = updateDto.isPublic;
    
    return this.postRepository.update(postId, updatedData);
  }catch(error){
    console.log("service", error);
    throw {error}
  }
}

  async deletePost(postId: number, postPassword: string):Promise<void>{
    try{
      const post = await this.postRepository.findPostById(postId);
      if(!post){
        throw {status: 404, message: "존재하지 않는 그룹"}
      }
      console.log("post", post);

      if(post.postPassword !== postPassword){
        console.log(post.postPassword, " " , postPassword);
        throw {status: 403, messgae: "틀린 비밀번호"}
      }

      await this.postRepository.delete(postId);

    }catch(error){
      throw {status: 404, message: "올바르지 않은 요청"}
    }
  }

  async getPostDetail(postId: number){
    try{
      const post = await this.postRepository.findPostById(postId);

      if(!post){
        throw {status: 404, message: "존재하지 않는 그룹"}
      }

      const tags = await this.postRepository.findPostTags(postId);
      post.tags = tags;

      console.log(post);

      return post;
    }catch(error){
      throw {status: 404, message: "틀린 요청"}
    }
  }

  async verifyPassword(postId: number, postPassword: string): Promise<boolean>{
    try{
      const post = await this.postRepository.findPostById(postId);
      if(!post){
        throw {status: 404, message: "존재하지 않는 그룹"}
      }

      console.log(post.postPassword , postPassword);

      if(post.postPassword !== postPassword){
        console.log(
          "틀린 비밀번호"
        )
        return false;
      }

      return true;
    }catch(error){
      console.log(error);
      throw {status: 404, message: "틀린 요청"}
    }
  }

  async postLike(groupId: number): Promise<void>{
    try{
      const post = await this.postRepository.findPostById(groupId);
      if(!post){
        throw {status: 404, message: "존재하지 않는 그룹"}
      }

      const updated = await this.postRepository.updateLike(groupId);
      await this.badgeService.postLike10000(updated.GID, updated.PostID, updated.LikeCount);
      
    }
    catch(error){
      throw {status: 404, message: "error"}
    }
    
  }

  async isPublic(postId: number): Promise<PostPublicDto>{
    try{
      return await this.postRepository.checkPublic(postId); 
    }catch(error){
      throw {status: 404, message: "failed"}
    }
  }

}