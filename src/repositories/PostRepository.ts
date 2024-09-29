import { PrismaClient } from "@prisma/client";
import { Post } from "../model/Post";

export class PostRepository{

  private prisma: PrismaClient;
  constructor(prisma: PrismaClient){
    this.prisma = prisma;
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



}