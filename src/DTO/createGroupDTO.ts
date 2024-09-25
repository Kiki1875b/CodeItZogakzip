export class CreateGroupDto {
  GName: string;
  GPassword: string;
  GImage?: string;
  IsPublic: boolean;
  GIntro?: string;

  constructor(name: string, password: string, isPublic: boolean, imageURL?: string, introduction?: string) {
    this.GName = name;
    this.GPassword = password;
    this.IsPublic = isPublic;
    this.GImage = imageURL;
    this.GIntro = introduction;
  }
}


export class UpdateGroupDto {
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