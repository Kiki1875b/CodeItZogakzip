export class Tag{
  constructor(
    public id: number,
    public name: string,
  ){}

  static fromPrisma(prismaTag: any) : Tag {
    return new Tag(
      prismaTag.TagID,
      prismaTag.Name
    );
  }
}