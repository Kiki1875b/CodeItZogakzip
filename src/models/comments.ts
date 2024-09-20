import { Table, Column, Model, DataType, ForeignKey, CreatedAt, BelongsTo } from 'sequelize-typescript';
import  Post  from './posts';

@Table({
  tableName: 'Comments',
  timestamps: false,
})
export default class Comment extends Model<Comment> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  CommentID!: number;

  @ForeignKey(() => Post)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  PostID!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  Nickname!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  Content!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  Password!: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  CreatedDate!: Date;

  @BelongsTo(() => Post)
  post!: Post;
}