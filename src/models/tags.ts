import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'Tags',
  timestamps: false,
})
export default class Tag extends Model<Tag> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  TagID!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  Name!: string;
}
