import { PrismaClient } from "@prisma/client";
import { Post } from "../model/Post";
import { CreatePostDto, PostPublicDto } from "../DTO/postDTO";
import { Tag } from "../model/Tag";

export class PostRepository{

  private prisma: PrismaClient;

  constructor(prisma: PrismaClient){
    this.prisma = prisma;
  }

  async create(groupId: number, postData: CreatePostDto): Promise<Post|undefined>{
    try{
      const result = await this.prisma.$transaction(async (prisma) => {

        // tag 관련 작업
        const tagPromises = postData.tags.map(async (tagName) => {
          let tag = await prisma.tag.findUnique({ where : {Name: tagName}}); 

          if(!tag){
            tag = await prisma.tag.create({data: {Name: tagName}});
          }
          return tag;
        });
        const tags = await Promise.all(tagPromises);

        // post 관련 작업
        const newPost = await prisma.post.create({
          data :{
            Nickname : postData.nickname,
            Title : postData.title,
            Content: postData.content,
            PPassword : postData.postPassword,
            IsPublic : postData.isPublic,
            Image : postData.imageUrl,
            Location : postData.location,
            MemoryMoment : postData.moment,
            GID: groupId,
            postTags:{
              create: tags.map((tag) => ({
                tag: {
                  connect: {TagID : tag.TagID },
                },
              })),
            },
          },
          include: {
            postTags: {
              include: {
                tag: true,
              }
            }
          },
        });


        


        return newPost;
      });

      await this.prisma.group.update({
        where: {GID: groupId},
        data: {
          PostCount: {increment: 1}
        }
      });

      return Post.fromPrisma(result);
  }catch(error){

    throw {status : 404, message: "Error creating Post"}
  }
}

async findMany(params: {groupId:number, page: number, pageSize: number, sortBy: string, keyword: string, isPublic: boolean}): Promise<{posts: Post[]; totalCount: number}>{
  try{const { groupId, page, pageSize, sortBy, keyword, isPublic } = params;
  const offset = (page - 1) * pageSize;
  const where = {
    GID: groupId,
    Title: {contains: keyword},
    IsPublic : isPublic,
  };

  const [posts, totalCount] = await Promise.all([
    this.prisma.post.findMany({
      where: where,
      skip: offset,
      take: pageSize,
      orderBy : this.getOrderBy(sortBy)
    }),
    this.prisma.post.count({where}),
  ]);

  return {
    posts : posts.map(Post.fromPrisma),
    totalCount,
  };}catch(error){
    console.log(error);
    throw {status: 403};
  }
}

async findPostTags(postId: number): Promise<Tag[]>{
  const postBadges = await this.prisma.postTag.findMany({
    where: {PostID: postId},
    include: { tag: true },
  });

  return postBadges.map(pb => Tag.fromPrisma(pb.tag));
}

async findPostById(postId: number): Promise<Post | null>{
  const post = await this.prisma.post.findUnique({
    where: { PostID : postId }
  });



  if(!post) return null;

  return Post.fromPrisma(post);
}
async updateLike(id: number){
  try{
    const updated = await this.prisma.post.update({
      where: {PostID: id},
      data: { LikeCount: { increment: 1 } },
      select: {PostID: true, GID: true, LikeCount: true}
    });

    return updated;
  }catch(error){
    throw {status: 404, message: "error while increasing"};
  }
}

async update(id : number, postData: any): Promise<Post>{
  
  try{
    await this.prisma.postTag.deleteMany({
      where: {PostID : id}
    })
    console.log(postData);
    const result = await this.prisma.$transaction(async (prisma)=> {

      const tagPromises = postData.tags.map(async (tagName: string) => {
        let tag = await prisma.tag.findUnique({ where : {Name: tagName}}); 

        if(!tag){
          tag = await prisma.tag.create({data: {Name: tagName}});
        }
        return tag;
      });
      const tags = await Promise.all(tagPromises);

      const updatedPost = await prisma.post.update({
        where : {PostID: id},
        data: {
          Nickname: postData.Nickname,
          Title: postData.Title,
          Content: postData.Content,
          PPassword: postData.PPassword,
          Image: postData.Image,
          Location: postData.Location,
          MemoryMoment: new Date(postData.MemoryMoment),
          IsPublic: postData.IsPublic,
          postTags:{
            create: tags.map((tag) => ({
              tag: {
                connect: {TagID: tag.TagID},
              },
            })),
          },
        },
        include:{
          postTags:{
            include:{
              tag: true,
            }
          }
        },
      });

      return updatedPost;
    });

    return Post.fromPrisma(result);
  }catch(error){
    console.log(error);
    throw {error}
  }
}



  async get7UniqueDates(groupId: number): Promise<Date[] | null>{
    const query = await this.prisma.$queryRaw<Array<{date: Date}>>`
    SELECT DISTINCT DATE(CreatedDate) as date 
    FROM \`Posts\`
    WHERE GID = ${groupId}
    ORDER BY date DESC 
    LIMIT 7;
  `;

    if(!query){
      return null;
    }

    return query.map((record)=> record.date);
  }

  async getPostDetail(postId: number): Promise <Post|null>{
    try{
      const post = await this.prisma.post.findUnique({
        where: {PostID: postId}
      });
      

      if(!post) return null;

      return Post.fromPrisma(post);
      
    }catch(error){
      throw error;
    }
  }

  async delete(postId: number):Promise<void>{
    await this.prisma.postTag.deleteMany({where: {PostID: postId}});
    await this.prisma.post.delete({where: {PostID : postId}});
  }

  async checkPublic(postId: number):Promise<PostPublicDto>{
    const post = await this.prisma.post.findUnique({
      where: {PostID : postId},
      select: {
        PostID : true,
        IsPublic : true,
      }
    });

    if(!post){
      throw new Error("Post not found");
    }

    return new PostPublicDto(post.PostID, post.IsPublic);
  }

  private getOrderBy(sortBy: string): any{
    switch (sortBy) {
      case 'latest':
        return {CreatedDate: 'desc'};
      case 'mostCommented':
        return {CommentCount: 'desc'};
      case 'mostLiked':
        return {LikeCount: 'desc'};
      default:
        return { CreatedDate: 'desc'};
    }
  }



}