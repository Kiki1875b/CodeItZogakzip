import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Default, CreatedAt, UpdatedAt, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'Group',
  timestamps: false
})
export default class Group extends Model<Group>{
  
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  GID!:number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  GName!:string;

  @Column({
    type: DataType.STRING(255)
  })
  GImage!:string;

  @Column({
    type: DataType.TEXT
  })
  GIntro!:string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false
  })
  IsPublic!: boolean;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  GPassword!: string;
  
  @CreatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW
  })
  CreatedDate!: Date;

  @Default(0)
  @Column({
    type: DataType.INTEGER
  })
  GLikes!:number;

  @Default(0)
  @Column({
    type: DataType.INTEGER
  })
  GBadgeCount!: number;

  @Default(0)
  @Column({
    type: DataType.INTEGER
  })
  PostCount!: number;
  

}