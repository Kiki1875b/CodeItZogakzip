import { Table, Column, Model, DataType, ForeignKey, PrimaryKey } from 'sequelize-typescript';
import  Post  from './posts';
import  Tag  from './tags';

@Table({
  tableName: 'Post_Tag',
  timestamps: false,
})
export default class PostTag extends Model<PostTag>{

  @PrimaryKey
  @ForeignKey(()=>Post)
  @Column({
    type: DataType.INTEGER,
    allowNull : false,
  })
  PostID!:number;

  @PrimaryKey
  @ForeignKey(() => Tag)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  TagID!: number;
}