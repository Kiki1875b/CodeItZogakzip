import { Table, Column, Model, DataType, ForeignKey, PrimaryKey, CreatedAt } from 'sequelize-typescript';
import  Group  from './group';
import  Badge  from './badges';

@Table({
  tableName: 'Group_Badge',
  timestamps: false,
})
export default class GroupBadge extends Model<GroupBadge> {
  @PrimaryKey
  @ForeignKey(() => Group)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  GID!: number;

  @PrimaryKey
  @ForeignKey(() => Badge)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  BadgeID!: number;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  ObtainedDate!: Date;
}
