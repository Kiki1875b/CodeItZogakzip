export class CreateGroupDto {
  GName: string;
  GImage?: string;
  GIntro?: string;
  IsPublic: boolean;
  GPassword: string;

  constructor(gName: string, isPublic: boolean, gPassword: string, gImage?: string, gIntro?: string) {
    this.GName = gName;
    this.IsPublic = isPublic;
    this.GPassword = gPassword;
    this.GImage = gImage;
    this.GIntro = gIntro;
  }
}
