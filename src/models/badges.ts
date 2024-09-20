import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'Badges',
  timestamps: false,
})
export default class Badge extends Model<Badge> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  BadgeID!: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  Name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  Description!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  Condition!: string;
}
