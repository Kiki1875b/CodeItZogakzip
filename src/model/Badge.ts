export class Badge {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public condition: string
  ) {}

  static fromPrisma(prismaBadge: any): Badge {
    return new Badge(
      prismaBadge.BadgeID,
      prismaBadge.Name,
      prismaBadge.Description,
      prismaBadge.Condition
    );
  }
}
