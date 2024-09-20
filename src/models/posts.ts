import {Table, Column, Model, DataType, ForeignKey, BelongsTo, CreatedAt, Default, PrimaryKey, AllowNull } from 'sequelize-typescript'
import Group from './group'

@Table({
  tableName: 'Posts',
  timestamps: false,
})
export default class Post extends Model<Post>{

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  PostID!: number;

  @ForeignKey(() => Group)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  GID!:number;

  @Column({
    type: DataType.STRING(51),
    allowNull : false
  })
  Nickname!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull : false
  })
  Title!:string;

  @Column({
    type : DataType.STRING(255)
  })
  Image!:string;

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  Content!:string;

  @Column({
    type: DataType.STRING(100)
  })
  Location!:string;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  MemoryMoment!:Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull : false
  })
  IsPublic!:boolean;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  PPassword!:string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW
  })
  CreatedDate!: Date;


  @Default(0)
  @Column(DataType.INTEGER)
  LikeCount!: number;

  @Default(0)
  @Column(DataType.INTEGER)
  CommentCount!: number;

  @BelongsTo(() => Group)
  group!: Group;
}